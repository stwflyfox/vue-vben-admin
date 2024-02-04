<template>
  <div class="context">
    <div class="leftArea">
      <Tabs tab-position="left" v-model:activeKey="system" @change="onTabChagne">
        <a-tab-pane v-for="item in systemTypes" :key="item.Value" :tab="`${item.Key}`" />
      </Tabs>
    </div>
    <div class="rightArea">
      <Row>
        <Col>
          <Form layout="inline" :model="tableform">
            <a-from-item label="表名：">
              <Input
                v-model="tableform.table_name"
                style="width: 150px"
                placeholder="请输入表名"
                size="small"
              />
            </a-from-item>
            <a-from-item label="表说明：" style="margin-right: 10px; margin-left: 10px">
              <Input
                v-model="tableform.table_common"
                style="width: 150px"
                placeholder="请输入表说明"
                size="small"
              />
            </a-from-item>
            <a-from-item>
              <Button type="primary" @click="queryList()" id="btnSearch" size="small">查询</Button>
              <Button
                type="primary"
                @click="OpenDialog()"
                id="btnAdd"
                size="small"
                style="margin-right: 10px; margin-left: 10px"
                >新建</Button
              >
              <Button type="primary" @click="RemoveTableInfo" id="btnDelete" size="small"
                >删除</Button
              >
            </a-from-item>
          </Form>
        </Col>
      </Row>
      <Row style="margin-top: 5px">
        <Col>
          <Table
            :columns="columns"
            :data-source="listData"
            :rowKey="(listData) => listData.table_id"
            :pagination="false"
            size="small"
            :scroll="{ y: tableHeight }"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            bordered
          >
            <template #bodyCell="{ column, record }">
              <span v-if="column.key === 'is_receivable'">{{
                record.is_receivable == 1 ? '是' : '否'
              }}</span>
              <span v-else-if="column.key === 'is_continuity'">{{
                record.is_continuity == 1 ? '是' : '否'
              }}</span>
              <span v-else-if="column.key === 'is_system'">{{
                record.is_system == 1 ? '是' : '否'
              }}</span>
              <span v-else-if="column.key === 'action'">
                <a @click="OpenDialog(record.table_id)" class="optEdit"
                  ><a-icon type="form" />修改</a
                >
                <a @click="EditState(record.table_id)" class="optStop" style="margin-left: 10px"
                  ><a-icon type="stop" />停用</a
                >
                <a
                  @click="OpenCopyDialog(record.table_id)"
                  class="optCopy"
                  style="margin-left: 10px"
                  ><a-icon type="copy" />复制</a
                >
              </span>
            </template>
          </Table>
          <div style="margin-top: 10px; float: right">
            <Pagination
              size="small"
              v-model:current="tableform.PageIndex"
              v-model:page-size="tableform.PageSize"
              :pageSizeOptions="tableform.pageSizeOptions"
              :total="tableform.TotalCount"
              :show-total="tableform.ShowTotal"
              showSizeChanger
              showQuickJumper
              :hideOnSinglePage="false"
              :default-current="tableform.PageIndex"
              :defaultPageSize="tableform.PageSize"
              @change="onChange"
              @show-size-change="onSizeChange"
            />
          </div>
        </Col>
      </Row>
    </div>

    <Modal
      :title="isEdit == 0 ? '新增业务表信息' : '修改业务表信息'"
      v-model:open="dialogForm"
      :dialog-style="{ top: '50px' }"
      @cancel="dialogForm = false"
      @ok="SaveTableInfo"
      width="75%"
    >
      <Row>
        <Col :span="24">
          <Form layout="inline" ref="businessFormRef" :model="businessForm">
            <FormItem label="ID:" :labelCol="{ style: 'width: 120px' }" style="display: none">
              <Input v-model:value="businessForm.table_id" size="small" style="width: 167px" />
            </FormItem>
            <FormItem
              label="业务表名："
              :labelCol="{ style: 'width: 120px' }"
              :rules="[{ rules: { required: true, message: '请输入业务表名!' } }]"
            >
              <Input
                placeholder="请输入业务表名"
                size="small"
                style="width: 150px"
                v-model:value="businessForm.table_name"
              />
            </FormItem>
            <FormItem
              label="业务表说明："
              :labelCol="{ style: 'width: 120px' }"
              :rules="[{ required: true, message: '请输入业务表说明!' }]"
            >
              <Input
                placeholder="请输入业务表说明"
                size="small"
                style="width: 150px"
                v-model:value="businessForm.table_common"
              />
            </FormItem>
            <FormItem
              label="是否系统表："
              :labelCol="{ style: 'width: 120px' }"
              :rules="[{ required: true, message: '请选择!' }]"
            >
              <Select style="width: 150px" size="small" v-model:checked="businessForm.is_system">
                <SelectOption
                  v-for="item in selectList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  >{{ item.label }}</SelectOption
                >
              </Select>
            </FormItem>
            <FormItem label="备注：" :labelCol="{ style: 'width: 120px' }">
              <Input
                placeholder="请输入备注"
                size="small"
                style="width: 150px"
                v-model:value="businessForm.remark"
              />
            </FormItem>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col :span="24" style="padding: 0 10px">
          <Space>
            <Button type="primary" icon="" size="small" @click="openColumnDialog(null)"
              >添加字段</Button
            >
            <Button type="primary" icon="" size="small" @click="addSystemFiled"
              >添加系统公用字段</Button
            >
            <Button type="primary" icon="" size="small" @click="openTableFieldDialog"
              >导入表字段</Button
            >
            <Button type="primary" icon="" size="small" @click="openDtoDialog">导入DTO字段</Button>
            <Button type="primary" icon="" size="small" @click="removeFieldInfo">删除</Button>
          </Space>
        </Col>
      </Row>
      <Row style="margin-top: 5px">
        <Col :span="24" style="padding: 0 10px">
          <Table
            :columns="detailColumns"
            :data-source="detailData"
            :rowKey="(detailData) => detailData.table_detail_id"
            size="small"
            :scroll="{ y: bllheight }"
            :pagination="false"
            :row-selection="{
              selectedRowKeys: selectedTableRowKeys,
              onChange: onSelectTableChange,
              getCheckboxProps: getCheckboxProps,
            }"
            bordered
          >
            <template #bodyCell="{ column, record }">
              <span v-if="column.key === 'is_must'">{{ record.is_must == 1 ? '是' : '否' }}</span>
              <span v-else-if="column.key === 'is_key'">{{
                record.is_key == 1 ? '是' : '否'
              }}</span>
              <span v-else-if="column.key === 'is_hide'">{{
                record.is_hide == 1 ? '是' : '否'
              }}</span>
              <span v-else-if="column.key === 'is_query'">{{
                record.is_query == 1 ? '是' : '否'
              }}</span>
              <span v-else-if="column.key === 'is_relation'">{{
                record.is_relation == 1 ? '是' : '否'
              }}</span>
              <span v-else-if="column.key === 'action'">
                <a @click="openColumnDialog(record)"><a-icon type="form" />修改</a>
                <a @click="optionUpDown(1, index)" v-if="index > 0" style="margin-left: 10px"
                  >上移</a
                >
                <a
                  @click="optionUpDown(2, index)"
                  v-if="index < detailData.length - 1"
                  style="margin-left: 10px"
                  >下移</a
                >
              </span>
            </template>
          </Table>
        </Col>
      </Row>
    </Modal>

    <Modal
      :title="isFiledEdit == 0 ? '添加字段' : '修改字段'"
      :visible="dialogColumnsForm"
      @cancel="dialogColumnsForm = false"
      @ok="SaveTableColumnsInfo"
      width="400px"
    >
      <Form layout="inline" ref="columnFormRef" :model="columnForm">
        <FormItem label="ID:" :labelCol="{ style: 'width: 120px' }" style="display: none">
          <Input v-decorator="['table_detail_id']" size="small" />
          <!--id字段隐藏-->
        </FormItem>
        <FormItem label="字段名称:" :labelCol="{ style: 'width: 120px' }" v-if="!ispublicField">
          <Input
            placeholder="请输入字段名称"
            size="small"
            v-decorator="[
              'field_name',
              { rules: [{ required: true, message: '请输入字段名称!' }] },
            ]"
          />
        </FormItem>
        <FormItem label="字段说明:" :labelCol="{ style: 'width: 120px' }" v-if="!ispublicField">
          <Input
            placeholder="请输入字段说明"
            size="small"
            v-decorator="[
              'field_common',
              { rules: [{ required: true, message: '请输入字段说明!' }] },
            ]"
          />
        </FormItem>
        <FormItem label="字段类型:" :labelCol="{ style: 'width: 120px' }" v-if="!ispublicField">
          <Select
            style="width: 173px"
            size="small"
            v-decorator="[
              'field_type',
              { rules: [{ required: true, message: '请选择字段类型!' }] },
            ]"
          >
            <SelectOption
              v-for="item in columnType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >{{ item.label }}</SelectOption
            >
          </Select>
        </FormItem>
        <FormItem label="字段长度:" :labelCol="{ style: 'width: 120px' }" v-if="!ispublicField">
          <Input
            style="width: 173px"
            placeholder="请输入字段长度"
            size="small"
            v-decorator="[
              'field_length',
              { rules: [{ required: true, message: '请输入字段长度!' }] },
            ]"
          />
        </FormItem>
        <FormItem label="允许null值:" :labelCol="{ style: 'width: 120px' }" v-if="!ispublicField">
          <Select
            style="width: 173px"
            size="small"
            v-decorator="['is_must', { rules: [{ required: true, message: '请选择!' }] }]"
          >
            <SelectOption
              v-for="item in selectList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >{{ item.label }}</SelectOption
            >
          </Select>
        </FormItem>
        <FormItem label="是否主键:" :labelCol="{ style: 'width: 120px' }" v-if="!ispublicField">
          <Select
            style="width: 173px"
            size="small"
            v-decorator="['is_key', { rules: [{ required: true, message: '请选择!' }] }]"
          >
            <SelectOption
              v-for="item in selectList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >{{ item.label }}</SelectOption
            >
          </Select>
        </FormItem>
        <FormItem label="是否隐藏：" :labelCol="{ style: 'width: 120px' }">
          <Select
            style="width: 173px"
            size="small"
            v-decorator="[
              'is_hide',
              { initialValue: 0, rules: [{ required: true, message: '请选择!' }] },
            ]"
          >
            <SelectOption
              v-for="item in selectList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >{{ item.label }}</SelectOption
            >
          </Select>
        </FormItem>
        <FormItem label="是否查询：" :labelCol="{ style: 'width: 120px' }">
          <Select
            style="width: 173px"
            size="small"
            v-decorator="[
              'is_query',
              { initialValue: 0, rules: [{ required: true, message: '请选择!' }] },
            ]"
          >
            <SelectOption
              v-for="item in selectList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >{{ item.label }}</SelectOption
            >
          </Select>
        </FormItem>
        <FormItem label="是否关联：" :labelCol="{ style: 'width: 120px' }" v-if="!ispublicField">
          <Select
            style="width: 173px"
            size="small"
            @change="onRelationInfo"
            v-decorator="[
              'is_relation',
              { initialValue: 0, rules: [{ required: true, message: '请选择!' }] },
            ]"
          >
            <SelectOption
              v-for="item in selectList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >{{ item.label }}</SelectOption
            >
          </Select>
        </FormItem>
        <FormItem
          label="关联表名："
          :labelCol="{ style: 'width: 120px' }"
          v-if="isRelation && !ispublicField"
        >
          <Select
            style="width: 173px"
            size="small"
            @change="handleTableChange"
            v-decorator="['relation_table']"
          >
            <SelectOption
              v-for="item in RelationData"
              :key="item.table_name"
              :label="item.table_common"
              :value="item.table_name"
              >{{ item.table_common }}</SelectOption
            >
          </Select>
        </FormItem>
        <FormItem
          label="关联字段："
          :labelCol="{ style: 'width: 120px' }"
          v-if="isRelation && !ispublicField"
        >
          <Select style="width: 173px" size="small" v-decorator="['relation_field']">
            <SelectOption
              v-for="item in RelationColumnData"
              :key="item.field_name"
              :label="item.field_common"
              :value="item.field_name"
              >{{ item.field_common }}</SelectOption
            >
          </Select>
        </FormItem>
        <FormItem
          label="显示字段："
          :labelCol="{ style: 'width: 120px' }"
          v-if="isRelation && !ispublicField"
        >
          <Select style="width: 173px" size="small" v-decorator="['relation_display_field']">
            <SelectOption
              v-for="item in RelationColumnData"
              :key="item.field_name"
              :label="item.field_common"
              :value="item.field_name"
              >{{ item.field_common }}</SelectOption
            >
          </Select>
        </FormItem>

        <FormItem label=" 排序:" :labelCol="{ style: 'width: 120px' }" v-if="!ispublicField">
          <InputNumber
            style="width: 173px"
            placeholder=""
            v-decorator="['field_index']"
            size="small"
          />
        </FormItem>
      </Form>
    </Modal>

    <Modal
      title="导入表字段"
      :visible="dialogFieldForm"
      @cancel="dialogFieldForm = false"
      :footer="null"
      :dialog-style="{ top: '50px' }"
      :body-style="{ padding: '0px 10px 20px 10px' }"
      width="80%"
    >
      <Row>
        <Col :span="8">
          <Input
            allow-clear
            v-model:value="fieldform.table_name"
            style="width: 150px"
            placeholder="请输入表名"
            size="small"
          />
          <Button type="primary" icon="" size="small" @click="SearchFiledInfo">查询</Button>

          <Table
            style="margin-top: 5px"
            :columns="fieldColumns"
            :data-source="fieldData"
            :rowKey="(fieldData) => fieldData.table_name"
            :pagination="false"
            size="small"
            :scroll="{ y: impheight }"
            :row-selection="{
              selectedRowKeys: selectedRadioRowKeys,
              onChange: onSelectFiledChange,
              type: 'radio',
            }"
            bordered
          />
        </Col>
        <Col :span="15" style="margin-left: 10px">
          <Space>
            <Button type="primary" icon="" size="small" @click="addColumnInfo">确定</Button>
            <Button type="primary" icon="" size="small" @click="cancelSelectInfo">取消勾选</Button>
          </Space>
          <Table
            style="margin-top: 5px"
            :columns="systemColumns"
            :data-source="systemData"
            :rowKey="(systemData) => systemData.field_name"
            size="small"
            :scroll="{ y: impheight }"
            :pagination="false"
            :row-selection="{ selectedRowKeys: selectedFiledRowKeys, onChange: onSelectAutoChange }"
            bordered
          >
            <template #bodyCell="{ column, record }">
              <span v-if="column.key === 'is_must'">{{ record.is_must == 1 ? '是' : '否' }}</span>
              <span v-if="column.key === 'is_key'">{{ record.is_key == 1 ? '是' : '否' }}</span>
            </template>
          </Table>
        </Col>
      </Row>
    </Modal>
    <Modal
      title="导入DTO字段"
      :visible="dialogDto"
      @cancel="dialogDto = false"
      :footer="null"
      :dialog-style="{ top: '50px' }"
      width="80%"
    >
      <Row>
        <Col :span="8">
          <Input
            allow-clear
            v-model:value="fieldform.table_name"
            style="width: 150px"
            placeholder="请输入关键字"
            size="small"
          />
          <Button type="primary" icon="" size="small" @click="SearchDtoName">查询</Button>

          <Table
            :columns="fieldColumns"
            :data-source="DtoList"
            :rowKey="(fieldData) => fieldData.table_name"
            :pagination="false"
            size="small"
            :scroll="{ y: impheight }"
            :row-selection="{
              selectedRowKeys: selectedDtoRowKeys,
              onChange: onSelectDtoChange,
              type: 'radio',
            }"
            bordered
          />
        </Col>
        <Col :span="15" style="margin-left: 10px">
          <Space>
            <Button type="primary" icon="" size="small" @click="addDtoFields">确定</Button>
            <Button type="primary" icon="" size="small" @click="selectedDtoFiledKeys = []"
              >取消勾选</Button
            >
          </Space>
          <Table
            :columns="systemColumns"
            :data-source="DtoFieldData"
            :rowKey="(DtoFieldData) => DtoFieldData.field_name"
            size="small"
            :scroll="{ y: impheight }"
            :pagination="false"
            :row-selection="{
              selectedRowKeys: selectedDtoFiledKeys,
              onChange: onSelectDtoFieldChange,
            }"
            bordered
          >
            <template #bodyCell="{ column, record }">
              <span v-if="column.key === 'is_must'">{{ record.is_must == 1 ? '是' : '否' }}</span>
              <span v-if="column.key === 'is_key'">{{ record.is_key == 1 ? '是' : '否' }}</span>
            </template>
          </Table>
        </Col>
      </Row>
    </Modal>

    <Modal
      title="生成SQL脚本"
      :visible="dialogScriptForm"
      @cancel="dialogScriptForm = false"
      :footer="null"
      :dialog-style="{ top: '100px' }"
      width="45%"
    >
      <Row>
        <Col :span="24">
          <Input v-model="scriptInfo" size="small" style="width: 98%" :rows="15" />
        </Col>
      </Row>
    </Modal>

    <Modal
      title="复制"
      :visible="dialogCopyDataForm"
      @cancel="dialogCopyDataForm = false"
      @ok="SaveCopyData"
      :dialog-style="{ top: '100px' }"
      width="400px"
    >
      <Form :form="copyform" layout="inline">
        <Row>
          <Col :span="24">
            <FormItem label="业务表名：" :labelCol="{ style: 'width: 120px' }">
              <Input v-model="copyform.table_name" size="small" placeholder="请输入字段名称" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="24">
            <FormItem label="业务表说明：" :labelCol="{ style: 'width: 120px' }">
              <Input
                v-model="copyform.table_common"
                size="small"
                placeholder="请输入字段名称"
                style="width: 200px"
              />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import {
    Tabs,
    Modal,
    Form,
    FormItem,
    Input,
    InputNumber,
    Select,
    SelectOption,
    Row,
    Col,
    Button,
    Space,
    Table,
    Pagination,
  } from 'ant-design-vue';
  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  import Enumerable from 'linq';
  import utils from '@/utils/util';
  import {
    QueryDtoList,
    QueryPageTableList,
    SaveBusinessTable,
    RemoveBusinessTable,
    GetPayType,
    QueryDBTables,
    StopBusinessTable,
    queryTableList,
    SaveCopyTable,
  } from '@/services/table';
  import { GetSystemType } from '@/services/system';

  //主表
  const columns = [
    {
      title: '操作',
      key: 'action',
      width: 130,
    },
    {
      title: '表名',
      dataIndex: 'table_name',
    },
    {
      title: '表说明',
      dataIndex: 'table_common',
    },
    {
      title: '系统表',
      dataIndex: 'is_system',
      key: 'is_system',
    },
    {
      title: '创建人',
      dataIndex: 'CreateName',
    },
    {
      title: '创建时间',
      dataIndex: 'CreateTime',
      width: 145,
    },
    {
      title: '更新人',
      dataIndex: 'UpdateName',
    },
    {
      title: '更新时间',
      dataIndex: 'UpdateTime',
      width: 145,
    },
  ];
  //明细表
  const detailColumns = [
    {
      title: '操作',
      key: 'action',
      width: 60,
    },
    {
      title: '字段名称',
      dataIndex: 'field_name',
    },
    {
      title: '字段说明',
      dataIndex: 'field_common',
    },
    {
      title: '字段类型',
      dataIndex: 'field_type',
      width: 75,
    },
    {
      title: '字段长度',
      dataIndex: 'field_length',
      width: 75,
    },
    {
      title: '允许null值',
      dataIndex: 'is_must',
      key: 'is_must',
      width: 85,
    },
    {
      title: '是否主键',
      dataIndex: 'is_key',
      key: 'is_key',
      width: 75,
    },
    {
      title: '是否隐藏',
      dataIndex: 'is_hide',
      key: 'is_hide',
      width: 75,
    },
    {
      title: '是否查询',
      dataIndex: 'is_query',
      key: 'is_query',
      width: 75,
    },
    {
      title: '是否关联',
      dataIndex: 'is_relation',
      key: 'is_relation',
      width: 75,
    },
    {
      title: '排序',
      dataIndex: 'field_index',
      width: 50,
    },
  ];
  //系统表列
  const systemColumns = [
    {
      title: '字段名称',
      dataIndex: 'field_name',
    },
    {
      title: '字段说明',
      dataIndex: 'field_common',
    },
    {
      title: '字段类型',
      dataIndex: 'field_type',
      width: 125,
    },
    {
      title: '允许null值',
      dataIndex: 'is_must',
      key: 'is_must',
      width: 85,
    },
    {
      title: '是否主键',
      dataIndex: 'is_key',
      key: 'is_key',
      width: 75,
    },
    {
      title: '排序',
      dataIndex: 'field_index',
      width: 50,
    },
  ];
  //系统表
  const fieldColumns = [
    {
      title: '表名',
      dataIndex: 'table_name',
    },
    {
      title: '表说明',
      dataIndex: 'table_common',
    },
  ];

  export default {
    name: 'Tables',
    components: {
      Tabs,
      Form,
      FormItem,
      Modal,
      Input,
      InputNumber,
      Select,
      SelectOption,
      Row,
      Col,
      Button,
      Space,
      Table,
      Pagination,
    },
    data() {
      return {
        zhCN,
        system: '2',
        tableHeight: window.innerHeight - 250,
        columns,
        detailColumns,
        fieldColumns,
        systemColumns,
        loading: false,
        dialogDto: false,
        AllDtoList: [],
        DtoList: [],
        selectedDtoRowKeys: [],
        selectedDtoFiledKeys: [],
        DtoFieldData: [],
        dialogForm: false, //新增业务表窗口
        dialogColumnsForm: false, //新增字段列
        dialogFieldForm: false, //导入数据库表字段
        dialogScriptForm: false,
        dialogCopyDataForm: false,
        listData: [],
        detailData: [],
        defaultData: [
          {
            field_name: 'CreateTime',
            field_common: '创建时间',
            field_type: 'datetime',
            field_length: '0',
            field_index: 100,
            is_must: 0,
            is_key: 0,
            is_system: 1,
            table_detail_id: -1,
            istag: -1,
            is_hide: 1,
            is_query: 0,
          },
          {
            field_name: 'CreateUser',
            field_common: '创建人id',
            field_type: 'varchar',
            field_length: '50',
            field_index: 101,
            is_must: 0,
            is_key: 0,
            is_system: 1,
            table_detail_id: -2,
            istag: -1,
            is_hide: 1,
            is_query: 0,
          },
          {
            field_name: 'CreateName',
            field_common: '创建人姓名',
            field_type: 'varchar',
            field_length: '50',
            field_index: 102,
            is_must: 0,
            is_key: 0,
            is_system: 1,
            table_detail_id: -3,
            istag: -1,
            is_hide: 1,
            is_query: 0,
          },
          {
            field_name: 'CreateIp',
            field_common: '创建人ip',
            field_type: 'varchar',
            field_length: '50',
            field_index: 103,
            is_must: 0,
            is_key: 0,
            is_system: 1,
            table_detail_id: -4,
            istag: -1,
            is_hide: 1,
            is_query: 0,
          },
          {
            field_name: 'UpdateTime',
            field_common: '更新时间',
            field_type: 'datetime',
            field_length: '0',
            field_index: 104,
            is_must: 1,
            is_key: 0,
            is_system: 1,
            table_detail_id: -5,
            istag: -1,
            is_hide: 1,
            is_query: 0,
          },
          {
            field_name: 'UpdateUser',
            field_common: '更新人id',
            field_type: 'varchar',
            field_length: '50',
            field_index: 105,
            is_must: 1,
            is_key: 0,
            is_system: 1,
            table_detail_id: -6,
            istag: -1,
            is_hide: 1,
            is_query: 0,
          },
          {
            field_name: 'UpdateName',
            field_common: '更新人姓名',
            field_type: 'varchar',
            field_length: '50',
            field_index: 106,
            is_must: 1,
            is_key: 0,
            is_system: 1,
            table_detail_id: -7,
            istag: -1,
            is_hide: 1,
            is_query: 0,
          },
          {
            field_name: 'UpdateIp',
            field_common: '更新人ip',
            field_type: 'varchar',
            field_length: '50',
            field_index: 107,
            is_must: 1,
            is_key: 0,
            is_system: 1,
            table_detail_id: -8,
            istag: -1,
            is_hide: 1,
            is_query: 0,
          },
          {
            field_name: 'CompanyID',
            field_common: '公司id',
            field_type: 'varchar',
            field_length: '50',
            field_index: 108,
            is_must: 1,
            is_key: 0,
            is_system: 1,
            table_detail_id: -8,
            istag: -1,
            is_hide: 1,
            is_query: 0,
          },
          {
            field_name: 'TenantId',
            field_common: '租户ID',
            field_type: 'varchar',
            field_length: '50',
            field_index: 109,
            is_must: 0,
            is_key: 0,
            is_system: 1,
            table_detail_id: -9,
            istag: -1,
            is_hide: 1,
            is_query: 0,
          },
        ],
        fieldData: [], //数据库表集合
        allfieldData: [],
        columnFieldData: [], //表字段集合
        systemData: [], //
        systemTypes: [],
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        tableform: {
          table_name: '', //业务表名
          table_common: '', //业务表说明
          PageIndex: 1, //第几页
          PageSize: 50, //每页中显示数据的条数
          TotalCount: 0, //总行数
          ShowTotal: (TotalCount) => `共 ${TotalCount} 条`, // 显示总数
          pageSizeOptions: ['10', '20', '50', '100'],
        },
        fieldform: {
          table_name: '', //业务表名
          system: 1,
          PageIndex: 1, //第几页
          PageSize: 50, //每页中显示数据的条数
          TotalCount: 0, //总行数
          ShowTotal: (TotalCount) => `共 ${TotalCount} 条`, // 显示总数
          pageSizeOptions: ['10', '20', '50', '100'],
        },
        selectList: [
          { value: 0, label: '否' },
          { value: 1, label: '是' },
        ],
        columnType: [
          { value: 'tinyint', label: 'tinyint' },
          { value: 'tinsmallintyint', label: 'smallint' },
          { value: 'mediumint', label: 'mediumint' },
          { value: 'bigint', label: 'bigint' },
          { value: 'float', label: 'float' },
          { value: 'double', label: 'double' },
          { value: 'decimal', label: 'decimal' },
          { value: 'numeric', label: 'numeric' },
          { value: 'int', label: 'int' },
          { value: 'char', label: 'char' },
          { value: 'varchar', label: 'varchar' },
          { value: 'text', label: 'text' },
          { value: 'date', label: 'date' },
          { value: 'time', label: 'time' },
          { value: 'datetime', label: 'datetime' },
        ],
        businessForm: {}, //业务表添加
        columnForm: {}, //业务表字段添加
        selectedRowKeys: [], //业务表管理=》复选框

        selectedRadioRowKeys: [], //导入表字段=》单选框
        selectedFiledRowKeys: [], //导入表字段=》复选框
        selectedTableRowKeys: [], //新增修改业务表=》复选框
        scriptInfo: '',
        isFiledEdit: 0, //0：添加，1：修改，字段标题
        isEdit: 0, //业务表标题
        recordArr: [],
        bllheight: '', //新增修改业务表字段
        impheight: '', //导入表字段高度
        isRelation: false, //是否显示关联信息
        RelationData: [], //关联业务表
        RelationColumnData: [], //关联业务表字段
        ispublicField: false, //是否公用字段
        copyform: {
          table_id: '',
          table_name: '',
          table_common: '',
        },
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        var loginInfo = utils.getloginInfo();
        loginInfo.system = this.system;
        utils.setloginInfo(loginInfo);
        var wh = window.innerHeight;
        this.impheight = wh - 50 - 120 - 150;
        this.onChange(1);
        // queryTableList().then((result) => {
        //   this.RelationData = result.data;
        // })
        GetSystemType().then((result) => {
          this.systemTypes = result.data;
        });
      },
      onChange(pageNumber) {
        //点击下一页事件
        this.tableform.PageIndex = pageNumber;
        this.queryList();
      },
      onChangeField(pageNumber) {
        //点击下一页事件
        this.fieldform.PageIndex = pageNumber;
        QueryDBTables(this.fieldform).then((result) => {
          this.fieldform.TotalCount = result.data.TotalCount;
          this.allfieldData = result.data.DataList;
          this.fieldData = this.allfieldData;
        });
      },
      queryList() {
        this.loading = true;
        QueryPageTableList(this.tableform).then((result) => {
          this.tableform.TotalCount = result.data.TotalCount;
          this.listData = result.data.DataList;
          this.loading = false;
        });
        // queryTableList().then((result) => {
        //   this.RelationData = result.data;
        // })
      },
      onProcess(instanceId) {
        this.processVisible = true;
        this.$refs.process.show(instanceId);
      },
      //每页显示的条目数选择事件
      onSizeChange(current, size) {
        this.tableform.PageSize = size; //每页显示的条目数
        this.onChange(current);
      },
      onSizeChangeField(current, size) {
        this.fieldform.PageSize = size; //每页显示的条目数
        this.onChangeField(current);
      },
      onExpand() {},
      OpenDialog(id = '') {
        //打开新增修改业务表页面
        var wh = window.innerHeight;
        this.bllheight = wh - 50 - 270 - 150; //窗口总高度-距离顶部高度-输入框高度-底部高度
        this.dialogForm = true;
        this.detailData = [];
        this.isEdit = 0;
        //清空表单数据
        this.$nextTick(() => {
          this.businessForm = {
            table_id: '', //id
            table_name: '', //业务表名
            table_common: '', //业务表说明
            is_receivable: 0, //是否参与应收款计算
            is_system: 0, //是否系统表
            is_continuity: 0, //是否连续性业务
            remark: '', //备注
            //默认字段
          };
        });
        //修改赋值
        if (!utils.isNullOrEmpty(id)) {
          queryTableList().then((response) => {
            if (response.success) {
              this.isEdit = 1;
              var item = Enumerable.from(response.data)
                .where((p) => p.table_id == id)
                .toArray();
              if (item.length > 0) {
                if (item[0].TableDetails.length > 0) {
                  item[0].TableDetails.forEach((p) => {
                    if (
                      p.field_name == 'CreateTime' ||
                      p.field_name == 'CreateUser' ||
                      p.field_name == 'CreateName' ||
                      p.field_name == 'CreateIp' ||
                      p.field_name == 'UpdateTime' ||
                      p.field_name == 'UpdateUser' ||
                      p.field_name == 'UpdateName' ||
                      p.field_name == 'UpdateIp' ||
                      p.field_name == 'TenantId'
                    ) {
                      p.istag = -1;
                    }
                  });
                }
                this.detailData = Enumerable.from(item[0].TableDetails)
                  .orderBy((t) => t.field_index)
                  .toArray();
                this.$nextTick(() => {
                  this.businessForm = {
                    table_id: item[0].table_id, //id
                    table_name: item[0].table_name, //业务表名
                    table_common: item[0].table_common, //业务表说明
                    is_receivable: item[0].is_receivable, //是否参与应收款计算
                    is_system: item[0].is_system, //是否系统表
                    is_continuity: item[0].is_continuity, //是否连续性业务
                    remark: item[0].remark, //备注
                  };
                });
              }
            }
          });
        } else {
          // this.defaultData.forEach(p => {
          //   p.is_hide = 1;
          //   p.is_query = 0;
          // })
          // this.detailData = Enumerable.from(this.defaultData).orderBy(t => t.field_index).toArray();
        }
      },
      SaveTableInfo(e) {
        //保存业务表数据
        e.preventDefault();

        let that = this;
        this.$refs.businessFormRef.validate().then(() => {
          var item = utils.clone(that.businessForm);
          item.TableDetails = that.detailData; //明细数据

          SaveBusinessTable(item).then((response) => {
            if (response.success) {
              that.dialogForm = false;
              that.queryList();
              utils.success('保存成功!');
            } else {
              utils.error('保存失败！');
            }
          });
        });
      },
      RemoveTableInfo() {
        //删除业务表数据
        if (this.selectedRowKeys.length > 0) {
          let self = this;
          Modal.confirm({
            title: '您确定要删除吗?',
            content: '',
            onOk() {
              var arr = self.selectedRowKeys;
              RemoveBusinessTable({ ids: arr }).then((response) => {
                if (response.success) {
                  self.queryList();
                  utils.success('删除成功!');
                } else {
                  utils.error(response.message);
                }
              });
            },
            onCancel() {},
          });
        } else {
          utils.warning('请勾选需要删除的数据！');
        }
      },
      EditState(id) {
        //停用业务表数据
        let self = this;
        this.$confirm({
          title: '您确定要停用吗?',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            StopBusinessTable({ id: id }).then((response) => {
              if (response.success) {
                self.queryList();
                utils.success('操作成功!');
              } else {
                utils.error(response.message);
              }
            });
          },
          onCancel() {},
        });
      },
      onSelectChange(selectedRowKeys) {
        //行勾选事件(多选)
        this.selectedRowKeys = selectedRowKeys;
      },
      onSelectFiledChange(selectedRowKeys) {
        //行勾选事件(单选)
        this.selectedRadioRowKeys = selectedRowKeys;
        var item = Enumerable.from(this.fieldData)
          .where((p) => p.table_name == this.selectedRadioRowKeys[0])
          .toArray();
        if (item.length > 0) {
          this.systemData = item[0].TableDetails;
        }
      },
      onSelectDtoChange(selectedRowKeys) {
        //行勾选事件(单选)
        debugger;
        this.selectedDtoRowKeys = selectedRowKeys;
        var item = Enumerable.from(this.AllDtoList)
          .where((p) => p.table_name == this.selectedDtoRowKeys[0])
          .toArray();
        if (item.length > 0) {
          this.DtoFieldData = item[0].TableDetails;
        }
        this.selectedDtoFiledKeys = [];
      },
      onSelectDtoFieldChange(selectedRowKeys) {
        //行勾选事件(单选)
        debugger;
        this.selectedDtoFiledKeys = selectedRowKeys;
      },

      openColumnDialog(item = null) {
        //新增修改业务表=》打开添加修改列窗口
        this.ispublicField = false;
        let self = this;
        this.dialogColumnsForm = true;
        this.isFiledEdit = 0;
        this.isRelation = false;
        //赋值为空
        this.$nextTick(() => {
          this.columnForm = {
            table_detail_id: '',
            field_name: '', //字段名称
            field_common: '', //字段说明
            field_type: '', //字段类型
            field_length: '', //字段长度
            is_must: 1, //允许null值
            is_key: 0, //是否主键
            field_index: this.detailData.length + 1, //排序
            is_hide: 0,
            is_query: 0,
            is_relation: 0,
            relation: '',
            relation_table: '',
            relation_field: '',
            relation_display_field: '',
          };
        });
        //修改赋值
        if (!utils.isNullOrEmpty(item)) {
          if (item.istag == -1) {
            self.ispublicField = true;
          }
          self.isFiledEdit = 1;
          var relation_table = '';
          var relation_field = '';
          var relation_display_field = '';
          this.$nextTick(() => {
            self.isRelation = false;
            if (item.is_relation == true || item.is_relation == 1) {
              self.isRelation = true;
              if (!utils.isNullOrEmpty(item.relationList)) {
                relation_table = item.relationList.RelationTableName;
                relation_field = item.relationList.RelationField;
                relation_display_field = item.relationList.DisplayField;
              }
            }
            setTimeout(() => {
              self.columnForm = {
                table_detail_id: item.table_detail_id,
                field_name: item.field_name, //字段名称
                field_common: item.field_common, //字段说明
                field_type: item.field_type, //字段类型
                field_length: item.field_length, //字段长度
                is_must: item.is_must == true || item.is_must == 1 ? 1 : 0, //允许null值
                is_key: item.is_key == true || item.is_key == 1 ? 1 : 0, //是否主键
                field_index: item.field_index, //排序
                is_hide: item.is_hide == true || item.is_hide == 1 ? 1 : 0, //是否隐藏
                is_query: item.is_query == true || item.is_query == 1 ? 1 : 0, //是否查询
                is_relation: item.is_relation == true || item.is_relation == 1 ? 1 : 0, //是否关联
                relation_table: relation_table, //关联表名
                relation_field: relation_field, //关联字段
                relation_display_field: relation_display_field, //显示字段
              };
            }, 500);
          });
        }
      },
      SaveTableColumnsInfo(e) {
        //新增修改业务表=》添加明细表字段
        e.preventDefault();
        this.$refs.columnFormRef.validateFields((err, item) => {
          if (!err) {
            item.relationList = {};
            item.relation = '';
            if (item.is_relation == '1') {
              if (utils.isNullOrEmpty(item.relation_table)) {
                utils.warning('请选择关联的表名');
                return;
              } else if (utils.isNullOrEmpty(item.relation_field)) {
                utils.warning('请选择关联字段');
                return;
              } else if (utils.isNullOrEmpty(item.relation_display_field)) {
                utils.warning('请选择显示名称');
                return;
              }

              var relationList = {
                RelationTableName: item.relation_table,
                RelationField: item.relation_field,
                DisplayField: item.relation_display_field,
              };
              item.relation = JSON.stringify(relationList);
              item.relationList = relationList;
            }
            //检查共用字段
            var _istag = '';
            var ckdft = Enumerable.from(this.defaultData)
              .where((p) => p.field_name == item.field_name)
              .toArray();
            if (ckdft.length > 0) {
              _istag = -1;
            }
            if (this.isFiledEdit == 0) {
              //添加字段
              //检查字段是否已经存在
              var ckrepeatlist = Enumerable.from(this.detailData)
                .where((p) => $.trim(p.field_name) == $.trim(item.field_name))
                .toArray(); //检查重复字段
              if (ckrepeatlist.length > 0) {
                utils.warning('字段名称[' + $.trim(item.field_name) + ']已经存在！');
                return;
              }

              item.table_detail_id = this.detailData.length + 1;
              this.detailData.push(item);
            } else {
              //修改字段
              //检查字段是否已经存在
              var ckeditrepeatlist = Enumerable.from(this.detailData)
                .where(
                  (p) =>
                    $.trim(p.field_name) == $.trim(item.field_name) &&
                    p.table_detail_id != item.table_detail_id,
                )
                .toArray(); //检查重复字段
              if (ckeditrepeatlist.length > 0) {
                utils.warning('字段名称[' + $.trim(item.field_name) + ']已经存在！');
                return;
              }

              var arr = Enumerable.from(this.detailData)
                .where((p) => p.table_detail_id == item.table_detail_id)
                .toArray();
              if (arr.length > 0) {
                arr[0].is_hide = item.is_hide;
                arr[0].is_query = item.is_query;
                if (!this.ispublicField) {
                  arr[0].field_common = item.field_common;
                  arr[0].field_index = item.field_index;
                  arr[0].field_length = item.field_length;
                  arr[0].field_name = item.field_name;
                  arr[0].field_type = item.field_type;
                  arr[0].is_key = item.is_key;
                  arr[0].is_must = item.is_must;
                  arr[0].is_relation = item.is_relation;
                  arr[0].relation = item.relation;
                  arr[0].relation_table = item.relation_table;
                  arr[0].relation_field = item.relation_field;
                  arr[0].relation_display_field = item.relation_display_field;
                  arr[0].relationList = item.relationList;
                  arr[0].istag = _istag;
                }
              }
            }
            this.detailData = Enumerable.from(this.detailData)
              .orderBy((p) => p.field_index)
              .toArray();
            this.dialogColumnsForm = false;
          }
        });
      },
      QueryPayType() {
        //新增修改业务表=》添加应收款字段
        let self = this;
        GetPayType().then((result) => {
          self.selectedTableRowKeys = []; //清除勾选项
          if (result.data.length > 0) {
            $.each(result.data, function (r, d) {
              d.is_key = d.is_key == true ? 1 : 0;
              d.is_must = d.is_must == true ? 1 : 0;
              d.is_system = d.is_system == true ? 1 : 0;
              //检查字段是否已经存在（存在就覆盖）
              var ckeditrepeatlist = self.detailData.findIndex(
                (p) =>
                  $.trim(p.field_name) == $.trim(d.field_name) &&
                  p.table_detail_id != d.table_detail_id,
              );
              if (ckeditrepeatlist >= 0) {
                self.detailData.splice(ckeditrepeatlist, 1);
              }
              self.detailData.push({
                table_detail_id: self.detailData.length + 1,
                field_common: d.field_common,
                field_index: d.field_index,
                field_length: d.field_length,
                field_name: d.field_name,
                field_type: d.field_type,
                is_key: d.is_key,
                is_must: d.is_must,
              });
            });
            self.detailData = Enumerable.from(self.detailData)
              .orderBy((t) => t.field_index)
              .toArray();
          }
        });
      },
      onSelectTableChange(selectedRowKeys) {
        //新增修改业务表=》删除选择行
        this.selectedTableRowKeys = selectedRowKeys;
      },
      removeFieldInfo() {
        //新增修改业务表=》删除字段
        if (this.selectedTableRowKeys.length > 0) {
          let self = this;

          Modal.confirm({
            title: '您确定要删除吗?',
            okText: '确定',
            cancelText: '取消',
            onOk() {
              var arr = self.selectedTableRowKeys;
              $.each(arr, function (r, d) {
                var _row = self.detailData.findIndex((p) => p.table_detail_id == d);
                if (_row >= 0) {
                  self.detailData.splice(_row, 1);
                }
              });
            },
            onCancel() {},
          });
        } else {
          utils.warning('请勾选需要删除的数据！');
        }
      },
      openDtoDialog() {
        QueryDtoList().then((result) => {
          if (result.success) {
            this.AllDtoList = result.data;
            this.DtoList = result.data;
            this.selectedDtoRowKeys = [];
            this.selectedDtoFiledKeys = [];
            this.dialogDto = true;
          } else {
            utils.error(result.message);
          }
        });
      },

      openTableFieldDialog() {
        //导入表字段=》打开窗口

        this.allfieldData = [];
        this.systemData = [];
        this.selectedRadioRowKeys = [];
        this.selectedFiledRowKeys = [];
        this.fieldform.table_name = '';
        this.dialogFieldForm = true;
        this.fieldform.system = this.system;
        QueryDBTables(this.fieldform).then((result) => {
          this.fieldform.TotalCount = result.data.TotalCount;
          this.allfieldData = result.data.DataList;
          this.fieldData = this.allfieldData;
        });
      },
      cancelSelectInfo() {
        //导入表字段=》取消勾选
        this.selectedFiledRowKeys = [];
      },
      SearchFiledInfo() {
        //导入表字段=>查询
        let that = this;

        if (!utils.isNullOrEmpty(that.fieldform.table_name)) {
          this.fieldData = Enumerable.from(that.allfieldData)
            .where(
              (p) =>
                p.table_name.indexOf(that.fieldform.table_name) >= 0 ||
                (p.table_common != '' &&
                  p.table_common != null &&
                  p.table_common.indexOf(that.fieldform.table_name) >= 0),
            )
            .toArray();
        } else {
          this.fieldData = this.allfieldData;
        }
        this.$forceUpdate();
      },
      SearchDtoName() {
        let that = this;

        if (!utils.isNullOrEmpty(that.fieldform.table_name)) {
          this.DtoList = Enumerable.from(that.AllDtoList)
            .where(
              (p) =>
                p.table_name.toLowerCase().indexOf(that.fieldform.table_name.toLowerCase()) >= 0 ||
                (p.table_common != '' &&
                  p.table_common != null &&
                  p.table_common.toLowerCase().indexOf(that.fieldform.table_name.toLowerCase()) >=
                    0),
            )
            .toArray();
        } else {
          this.DtoList = this.AllDtoList;
        }
        this.$forceUpdate();
      },
      onSelectAutoChange(selectedRowKeys) {
        //导入表字段=>字段勾选
        this.selectedFiledRowKeys = selectedRowKeys;
      },
      addColumnInfo() {
        //导入表字段=>》确定
        let self = this;
        if (this.selectedFiledRowKeys.length <= 0) {
          utils.warning('请勾选需要导入的数据！');
          return;
        }
        $.each(this.selectedFiledRowKeys, function (r, d) {
          var item = Enumerable.from(self.systemData)
            .where((p) => p.field_name == d)
            .toArray()[0];
          var _first = item.field_type.indexOf('(');
          var _last = item.field_type.indexOf(')');

          //检查字段是否已经存在
          var ckeditrepeatlist = self.detailData.findIndex(
            (p) =>
              $.trim(p.field_name) == $.trim(item.field_name) &&
              p.table_detail_id != item.table_detail_id,
          );
          if (ckeditrepeatlist >= 0) {
            //如果是公共字段跳过
            var pfield = Enumerable.from(self.defaultData)
              .where((p) => $.trim(p.field_name) == $.trim(item.field_name))
              .toArray();
            if (pfield.length > 0) {
              return;
            } else {
              self.detailData.splice(ckeditrepeatlist, 1);
            }
          }
          self.detailData.push({
            table_detail_id: self.detailData.length + 1,
            field_common: item.field_common,
            field_index: self.detailData.length + 1, // item.field_index,
            field_name: item.field_name,
            field_type: _first > 0 ? item.field_type.substr(0, _first) : item.field_type,
            field_length:
              _first > 0 && _last > 0 ? item.field_type.substr(_first + 1, _last - _first - 1) : 0,
            is_key: item.is_key,
            is_must: item.is_must,
          });
        });
        self.detailData = Enumerable.from(self.detailData)
          .orderBy((p) => p.field_index)
          .toArray();
        this.dialogFieldForm = false;
      },
      addDtoFields() {
        //导入DtO字段=>》确定
        debugger;
        let self = this;
        if (this.selectedDtoFiledKeys.length <= 0) {
          utils.warning('请勾选需要导入的数据！');
          return;
        }
        $.each(this.selectedDtoFiledKeys, function (r, d) {
          var item = Enumerable.from(self.DtoFieldData)
            .where((p) => p.field_name == d)
            .toArray()[0];
          var _first = item.field_type.indexOf('(');
          var _last = item.field_type.indexOf(')');

          //检查字段是否已经存在
          var ckeditrepeatlist = self.detailData.findIndex(
            (p) => $.trim(p.field_name) == $.trim(item.field_name),
          );
          if (ckeditrepeatlist >= 0) {
            //如果是公共字段跳过
            var pfield = Enumerable.from(self.defaultData)
              .where((p) => $.trim(p.field_name) == $.trim(item.field_name))
              .toArray();
            if (pfield.length > 0) {
              return;
            } else {
              self.detailData.splice(ckeditrepeatlist, 1);
            }
          }

          var fieldIndex = self.detailData.length + 1;
          var pfield = Enumerable.from(self.defaultData)
            .where((p) => $.trim(p.field_name) == $.trim(item.field_name))
            .toArray();
          if (pfield.length > 0) {
            fieldIndex = pfield[0].field_index;
          }

          self.detailData.push({
            table_detail_id: fieldIndex,
            field_common: item.field_common,
            field_index: fieldIndex, // item.field_index,
            field_name: item.field_name,
            field_type: _first > 0 ? item.field_type.substr(0, _first) : item.field_type,
            field_length:
              _first > 0 && _last > 0 ? item.field_type.substr(_first + 1, _last - _first - 1) : 0,
            is_key: item.is_key,
            is_must: item.is_must,
          });
        });
        self.detailData = Enumerable.from(self.detailData)
          .orderBy((p) => p.field_index)
          .toArray();
        this.dialogDto = false;
      },
      createScriptInfo() {
        //创建脚本
        this.dialogScriptForm = true;
        var info = '',
          info2 = '';
        info = ' CREATE TABLE ' + this.businessForm['table_name'] + ' (\n';
        for (var i = 0; i < this.detailData.length; i++) {
          var d = this.detailData[i];
          var key = d.is_key == '1' ? ' primary key ' : '';
          if (key != '') {
            key = ' primary key ';
          } else {
            key = d.is_must == '1' ? ' NULL ' : ' NOT NULL ';
          }
          var lengthData = '';
          if (d.field_type == 'date' || d.field_type == 'datetime') {
            lengthData = '';
          } else {
            lengthData = '(' + d.field_length + ') ';
          }

          if (i == this.detailData.length - 1) {
            info2 +=
              ' ' +
              d.field_name +
              '  ' +
              d.field_type +
              lengthData +
              key +
              " COMMENT '" +
              d.field_common +
              "'\n";
          } else {
            info2 +=
              ' ' +
              d.field_name +
              '  ' +
              d.field_type +
              lengthData +
              key +
              " COMMENT '" +
              d.field_common +
              "',\n";
          }
        }
        info = info + info2 + ' ) \n';
        info += " COMMENT = '" + this.businessForm['table_common'] + "';";
        this.scriptInfo = info;
      },
      getCheckboxProps(record) {
        //公用字段不允许删除
        return {
          props: {
            disabled: record.istag === -1, //禁止勾选
          },
        };
      },
      addSystemFiled() {
        //添加系统公用字段
        this.selectedTableRowKeys = []; //清除勾选项
        this.defaultData.forEach((p) => {
          var item = Enumerable.from(this.detailData)
            .where((a) => $.trim(a.field_name) == $.trim(p.field_name))
            .toArray();
          if (item.length == 0) {
            this.detailData.push(p);
          }
        });
      },
      optionUpDown(type, index) {
        //1上移，2下移
        if (type == 1) {
          var item = this.detailData[index]; //当前数据
          var item2 = this.detailData[index - 1]; //上一个数据
          var a = item.field_index;
          var b = item2.field_index;
          item.field_index = b;
          item2.field_index = a;
          this.detailData = Enumerable.from(this.detailData)
            .orderBy((p) => p.field_index)
            .toArray();
        } else {
          item = this.detailData[index]; //当前数据
          item2 = this.detailData[index + 1]; //下一个数据
          a = item.field_index;
          b = item2.field_index;
          item.field_index = b;
          item2.field_index = a;
          this.detailData = Enumerable.from(this.detailData)
            .orderBy((p) => p.field_index)
            .toArray();
        }
      },
      onRelationInfo(value) {
        //关联其它表
        this.isRelation = false;
        if (value == 1) {
          this.isRelation = true;
        }
      },
      handleTableChange(value) {
        this.columnForm = {
          relation_table: '',
          relation_field: '',
          relation_display_field: '',
        };
        this.RelationColumnData = [];
        var arrs = Enumerable.from(this.RelationData)
          .where((p) => p.table_name == value)
          .toArray();
        if (arrs.length > 0) {
          this.RelationColumnData = arrs[0].TableDetails;
        } else {
          this.RelationColumnData = [];
        }
      },
      OpenCopyDialog(id) {
        //打开复制窗口
        this.copyform.table_id = id;
        this.copyform.table_name = '';
        this.copyform.table_common = '';

        this.dialogCopyDataForm = true;
      },
      SaveCopyData() {
        //保存复制数据
        if (utils.isNullOrEmpty(this.copyform.table_name)) {
          utils.warning('请输入业务表名!');
          return;
        } else if (utils.isNullOrEmpty(this.copyform.table_common)) {
          utils.warning('请输入业务表说明!');
          return;
        }
        SaveCopyTable(this.copyform).then((response) => {
          if (response.success) {
            this.dialogCopyDataForm = false;
            this.queryList();
            utils.success('保存成功!');
          } else {
            utils.error('保存失败！');
          }
        });
      },
      onChangeSystemType(system) {
        this.fieldform.table_name = null;
        QueryDBTables(this.fieldform).then((result) => {
          this.fieldform.TotalCount = result.data.TotalCount;
          this.allfieldData = result.data.DataList;
          this.fieldData = this.allfieldData;
        });
      },
      onTabChagne(system) {
        var loginInfo = utils.getloginInfo();
        loginInfo.system = system;
        utils.setloginInfo(loginInfo);
        this.queryList();
      },
    },
  };
</script>

<style scoped>
  .context {
    width: 100%;
    height: 100%;
    background-color: white;
  }

  .leftArea {
    width: 140px;
    padding: 5px;
    vertical-align: top;
  }

  .rightArea {
    position: absolute;
    inset: 0 0 0 140px;
    padding: 5px;
  }
</style>

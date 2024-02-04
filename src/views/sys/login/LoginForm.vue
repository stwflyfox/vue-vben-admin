<template>
  <a-flex
    justify="center"
    style="
      width: 100%;
      height: 80px;
      color: white;
      font-size: 32px;
      line-height: 80px;
      text-align: center;
    "
  >
    <div>
      <img src="../../../assets/images/logo.png" width="40" height="40" />
      {{ title }}
    </div>
  </a-flex>
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <FormItem name="company" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.company"
        :placeholder="'公司码'"
        class="fix-auto-fill"
      >
        <template #prefix>
          <GlobalOutlined />
        </template>
      </Input>
    </FormItem>
    <FormItem name="account" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.account"
        :placeholder="t('sys.login.userName')"
        class="fix-auto-fill"
      >
        <template #prefix>
          <user-outlined />
        </template>
      </Input>
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        size="large"
        visibilityToggle
        v-model:value="formData.password"
        :placeholder="t('sys.login.password')"
      >
        <template #prefix>
          <LockOutlined />
        </template>
      </InputPassword>
    </FormItem>

    <FormItem class="enter-x">
      <Button
        type="primary"
        style="background: orange"
        size="large"
        block
        @click="handleLogin"
        :loading="loading"
      >
        {{ t('sys.login.loginButton') }}
      </Button>
    </FormItem>
    <ARow class="enter-x">
      <ACol :span="24"
        ><div style="color: white; font-size: 16px"
          >©2024 上海启业信息技术有限公司 91zd.cn 版本:{{ version }}
        </div>
      </ACol>
    </ARow>

    <!-- <Divider class="enter-x">{{ t('sys.login.otherSignIn') }}</Divider>

    <div class="flex justify-evenly enter-x" :class="`${prefixCls}-sign-in-way`">
      <GithubFilled />
      <WechatFilled />
      <AlipayCircleFilled />
      <GoogleCircleFilled />
      <TwitterCircleFilled />
    </div> -->
  </Form>
</template>
<script lang="ts" setup>
  import { useGlobSetting } from '@/hooks/setting';

  import { reactive, ref, unref, computed } from 'vue';

  import { UserOutlined, LockOutlined, GlobalOutlined } from '@ant-design/icons-vue';

  import { Form, Input, Row, Col, Button } from 'ant-design-vue';

  import { useI18n } from '@/hooks/web/useI18n';
  import { useMessage } from '@/hooks/web/useMessage';

  import { useUserStore } from '@/store/modules/user';
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';
  import { useDesign } from '@/hooks/web/useDesign';
  //import { onKeyStroke } from '@vueuse/core';
  import md5 from 'js-md5';
  import { getSystemVersion } from '@/services/user';

  const ACol = Col;
  const ARow = Row;
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { notification, createErrorModal } = useMessage();
  const { prefixCls } = useDesign('login');
  const userStore = useUserStore();

  const { title } = useGlobSetting();

  const { getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    company: '',
    account: '',
    password: '',
  });

  const version = ref('');

  const { validForm } = useFormValid(formRef);

  //onKeyStroke('Enter', handleLogin);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  getSystemVersion().then((response) => {
    version.value = response.data;
  });

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const userInfo = await userStore.login({
        company: data.company,
        password: md5(data.password),
        username: data.account,
        mode: 'none', //不要默认的错误提示
      });
      if (userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.realName}`,
          duration: 3,
        });
      }
    } catch (error) {
      createErrorModal({
        title: t('sys.api.errorTip'),
        content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
        getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      });
    } finally {
      loading.value = false;
    }
  }
</script>

<template>
  <div>
    <div class="search">
      <tiny-input
        class="search-input"
        placeholder="搜索图标"
        v-model="searchName"
        clearable
        size="small"
      />
    </div>
    <div class="svgs-context">
      <div class="svgs-wrapper">
        <div v-for="(nameList, groupName) in iconGroups" :key="groupName">
          <div class="group-name">
            {{ groupName }}
          </div>
          <template v-for="name in nameList">
            <div
              v-if="searchName === '' || name.toLowerCase().includes(searchName.toLowerCase())"
              :key="name"
              class="svgs-item"
              @click="click(name)"
            >
              <component :is="Svgs[name] && Svgs[name]()" class="svgs-icon"/>
              <span class="svgs-text">{{ name }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Svgs from '@opentiny/vue-icon';
  import { Input } from '@opentiny/vue';
  import { iconGroups } from 'https://res.hc-cdn.com/tiny-vue-web-doc/2.1.47.20231217150537/@demos/app/icon/iconGroups.js';

  export default {
    emits: ['click'],
    components: {
      TinyInput: Input,
    },
    data() {
      const all = Object.values(iconGroups).flat();
      iconGroups.Others = Object.keys(Svgs).filter(
        (name) => !all.includes(name) && name[0] === 'I',
      );

      return {
        iconGroups,
        Svgs,
        searchName: '',
      };
    },
    methods: {
      click(name) {
        //window.navigator.clipboard.writeText(name)
        // Modal.message({
        //     message: `成功复制图标名称 ${name} `,
        //     status: 'info'
        // })
        this.$emit('click', name);
      },
    },
  };
</script>

<style scoped>
  .svgs-context {
    height: calc(100vh - 150px);
    overflow-y: auto;
  }

  .svgs-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
  }

  .icon-container {
    display: grid;
    grid-template-columns: repeat(5, 20%);
  }

  .search {
    display: flex;
    flex-direction: row;
    margin-bottom: 16px;
  }

  .search-input {
    width: 250px;
  }

  .group-name {
    font-weight: 400;
    font-size: 18px;
    line-height: 26px;
    padding: 0 0 8px 20px;
    margin-bottom: 20px;
    border-bottom: solid 1px #ccc;
  }

  .svgs-icon {
    cursor: pointer;
    transition: all 0.4s;
    fill: #000;
    font-size: 24px;
  }

  .svgs-icon:hover {
    transform: scale(1.5, 1.5);
  }

  .svgs-item {
    width: 20%;
    text-align: center;
    display: inline-block;
    padding: 24px;
  }

  .svgs-item:hover {
    background-color: #f6f8fa;
  }

  .svgs-text {
    margin-top: 12px;
    display: block;
    font-size: 12px;
    font-weight: 600;
  }
</style>

<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="handleLogout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          router
          :default-active="activePath">
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/' + elem.path" v-for="elem in item.children" :key="elem.id" @click="saveNavState('/' + elem.path)">
              <i class="el-icon-menu"></i>
              <span>{{elem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 主题 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  data () {
    return {
      menulist: [],
      iconObj: {
        125: 'el-icon-s-custom',
        103: 'el-icon-s-check',
        101: 'el-icon-s-goods',
        102: 'el-icon-document',
        145: 'el-icon-s-data'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  methods: {
    // 退出
    handleLogout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取菜单数据
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.menulist = res.data
      }
    },
    // 折叠菜单
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存菜单状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: 0;
  }
}
.el-main {
  background-color: #eaedf1;
}
.toggle-button {
  background-color: #4a5064;
  text-align: center;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>

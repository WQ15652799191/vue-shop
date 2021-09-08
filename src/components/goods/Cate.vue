<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <tree-table
            :data="catelist"
            :columns="columns"
            :selection-type="false"
            :expand-type="false"
            show-index
            index-text="#"
            border
            class="treetable">
            <template slot="isok" slot-scope="scope">
                <i v-if="scope.row.cat_deleted === false" class="el-icon-success" style="color: green; font-size: 14px"></i>
                <i v-else class="el-icon-error" style="color: red; font-size: 14px"></i>
            </template>
            <template slot="order" slot-scope="scope">
                <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
                <el-tag v-else-if="scope.row.cat_level === 1" type="warning">二级</el-tag>
                <el-tag v-else type="success">三级</el-tag>
            </template>
            <template slot="opt" slot-scope>
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </template>
            </tree-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 10, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%"
        @closed="addCateDialogClose">
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
            <el-form-item label="分类名称：" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类：">
                <el-cascader
                style="width: 100%"
                clearable
                change-on-select
                v-model="selectedKeys"
                :options="parentCateList"
                :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', children: 'children' }"
                @change="parentCateChange"></el-cascader>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        type: 'template',
        template: 'isok'
      }, {
        label: '排序',
        type: 'template',
        template: 'order'
      }, {
        label: '操作',
        type: 'template',
        template: 'opt'
      }],
      catelist: [],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_id: 0,
        cat_level: 0
      },
      selectedKeys: [],
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      parentCateList: []
    }
  },
  methods: {
    // 获取商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品失败')
      }
      this.catelist = res.data.result
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 添加分类
    showAddCateDialog () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }
      this.parentCateList = res.data
    },
    parentCateChange () {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_level = this.selectedKeys.length
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
      } else {
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      }
    },
    addCateDialogClose () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类成功')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    }
  },
  created () {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.treetable {
    margin-top: 10px;
}
</style>

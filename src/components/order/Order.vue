<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row>
            <el-col :span="8">
              <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="getOrderList">
                <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
              </el-input>
            </el-col>
          </el-row>
          <el-table :data="orderlist" stripe border>
              <el-table-column type="index"></el-table-column>
              <el-table-column label="订单编号" prop="order_number" width="250px"></el-table-column>
              <el-table-column label="订单价格" prop="order_price"></el-table-column>
              <el-table-column label="是否付款" prop="pay_status">
                  <template slot-scope="scope">
                      <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
                      <el-tag type="danger" v-else>未付款</el-tag>
                  </template>
              </el-table-column>
              <el-table-column label="是否发货" prop="is_send"></el-table-column>
              <el-table-column label="下单时间" prop="create_time">
                  <template slot-scope="scope">
                      {{scope.row.create_time | dateFormat}}
                  </template>
              </el-table-column>
              <el-table-column label="操作">
                  <template slot-scope>
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
                         <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
                  </template>
              </el-table-column>
          </el-table>
          <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 15, 10, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <el-dialog
        title="修改地址"
        :visible.sync="addressVisible"
        width="50%"
        @close="handleClose">
        <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
            <el-form-item label="省市区/县" prop="address1">
                <el-cascader :options="cityData" v-model="addressForm.address1" style="width: 100%"></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="address2">
                <el-input v-model="addressForm.address2"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addressVisible = false">取 消</el-button>
            <el-button type="primary" @click="addressVisible = false">确 定</el-button>
        </span>
        </el-dialog>
        <el-dialog
        title="物流进度"
        :visible.sync="progressVisible"
        width="50%">
        <el-timeline>
            <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
            </el-timeline-item>
        </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
import cityData from './citydata.js'

export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderlist: [],
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [{ required: true, message: '请选择', trigger: 'blur' }],
        address2: [{ required: true, message: '请填写', trigger: 'blur' }]
      },
      cityData,
      progressVisible: false,
      progressInfo: []
    }
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单失败')
      }
      this.total = res.data.total
      this.orderlist = res.data.goods
    },
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getOrderList()
    },
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.getOrderList()
    },
    showBox () {
      this.addressVisible = true
    },
    handleClose () {
      this.$refs.addressFormRef.resetFields()
    },
    async showProgressBox () {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流失败')
      }
      this.progressInfo = res.data
      this.progressVisible = true
    }
  },
  created () {
    this.getOrderList()
  }
}
</script>

<style lang="less" scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';

</style>

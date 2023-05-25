<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- table表格区域 -->
    <el-table :data="goodslist" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
      <el-table-column label="创建时间" prop="add_time" width="140px">
        <template slot-scope="scope">
          {{ scope.row.add_time | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130px">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editByRow(scope.row)"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeById(scope.row.goods_id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑商品信息的对话框 -->
    <el-dialog title="编辑商品信息" :visible.sync="editGoodDialogVisible" width="70%">
      <el-form :model="goodInfo" ref="editGoodsFormRef" label-width="70px" :rules="editGoodsFormRules">
        <el-form-item label="重量" required>
          <el-input v-model.number="goodInfo.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="数量" required>
          <el-input v-model.number="goodInfo.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="价格" required>
          <el-input v-model.number="goodInfo.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="名称" required>
          <el-input v-model="goodInfo.goods_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGood">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品ID
      goodsId: 0,
      // 查询参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      // 商品信息
      goodInfo: {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [1402, 1428, 1454],
      },
      //   编辑商品信息表格的验证规则对象
      editGoodsFormRules: {
        req1: [{ required: true, message: "请输入内容", trigger: "blur" }],
        req2: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
      editGoodDialogVisible: false,
      // 商品列表
      goodslist: [],
      // 总数据条数
      total: 0,
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      })

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败！")
      }

      this.$message.success("获取商品列表成功！")
      console.log(res.data)
      this.goodslist = res.data.goods
      this.total = res.data.total
    },

    // 编辑商品操作
    async editByRow(good) {
      this.goodInfo.goods_weight = good.goods_weight
      this.goodInfo.goods_name = good.goods_name
      this.goodInfo.goods_price = good.goods_price
      this.goodInfo.goods_number = good.goods_number
      this.goodsId = good.goods_id
      console.log(this.goodInfo)

      const { data: res } = await this.$http.get(`goods/${this.goodsId}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success("根据ID查询商品成功!")
      console.log(res)
      this.goodInfo.goods_cat = res.data.goods_cat
      // this.goodInfo.goods_cat = res.data.goods_cat.split(",")
      // this.goodInfo.goods_cat = this.goodInfo.goods_cat.forEach((i) => {
      //   i - "0"
      // })
      this.editGoodDialogVisible = true
    },

    // 确定提交编辑后的商品信息
    editGood() {
      this.$refs.editGoodsFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请输入完整的商品信息！")
        }
        console.log(this.goodInfo)
        const { data: res } = await this.$http.put(`goods/${this.goodsId}`, this.goodInfo)
        if (res.meta.status !== 201) {
          return this.$message.error("编辑商品提交失败!")
        }
        this.$message.success("编辑成功!")
        console.log(res.data)
        this.$refs.editGoodsFormRef.resetFields()
        this.editGoodDialogVisible = false
      })
    },

    // 删除商品操作
    async removeById(id) {
      const confirmResult = await this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err)

      if (confirmResult !== "confirm") {
        return this.$message.info("已经取消删除!")
      }

      const { data: res } = await this.$http.delete(`goods/${id}`)

      if (res.meta.status !== 200) {
        return this.$message.error("删除失败!")
      }

      this.$message.success("删除成功!")
      this.getGoodsList()
    },

    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },

    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },

    goAddpage() {
      this.$router.push("/goods/add")
    },
  },
}
</script>

<style></style>

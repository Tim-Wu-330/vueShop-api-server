<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-button type="primary" @click="showAddRoleDialog">添加角色</el-button>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for 循环 嵌套二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{
                      item2.authName
                    }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditRightDialog(scope.row)"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRole(scope.row)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色的对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="50%" @close="addRoleDialogClosed">
      <el-form :model="roleRights" :rules="editRightsRules" ref="addRoleRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleRights.roleName" ref="addRoleFirstInput"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" >
          <el-input v-model="roleRights.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addRole">确定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑权限的对话框 -->
    <el-dialog title="编辑权限" :visible.sync="editRightDialogVisible" width="50%" @close="editRightDialogClosed">
      <el-form :model="roleRights" :rules="editRightsRules" ref="editRoleRightsRef" label-width="80px">
      <el-form-item label="角色名称" prop="roleName">
      <el-input ref="editDialogFirstInput" v-model="roleRights.roleName"></el-input>
    </el-form-item>
    <el-form-item label="角色描述" >
    <el-input v-model="roleRights.roleDesc"></el-input>
   </el-form-item>
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRightDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editRights">确定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree
        :data="rightslist"
        show-checkbox
        node-key="id"
        default-expanded-all
        :default-checked-keys="defKeys"
        ref="treeRef"
        :props="treeProps"
      >
      </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="allotRights">确定</el-button>
        </span>  
    </el-dialog>

    
  </div>
</template>

    <script>
      export default {
        data() {
          return {
            // 所有角色列表数据
            rolelist: [],
            // 所有权限的数据
            rightslist: [],
            // 控制添加角色对话框的显示和隐藏
            addRoleDialogVisible: false,
            // 控制编辑权限对话框的显示和隐藏
            editRightDialogVisible: false,
            // 编辑角色表单验证规则
            editRightsRules: {
              roleName: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
            },
            // 控制分配权限对话框的显示和隐藏
            setRightDialogVisible: false,
            // 当前角色信息
            roleRights: {
              roleName: "",
              roleDesc: ""
            },
            // 默认选中的节点Id值数组
            defKeys: [],
            // 树形控件的属性绑定对象
            treeProps: {
              label: "authName",
              children: "children",
            },
            // 当前即将分配权限的角色Id
            roleId: "",
          }
        },
        created() {
          this.getRolesList()
        },
        watch: {
          editRightDialogVisible(value) {
            if (value === true) {
              this.$nextTick(() => {
                this.$refs.editDialogFirstInput.focus()
              })
            }
          },
          addRoleDialogVisible(value) {
            if (value === true) {
              this.$nextTick(() => {
                this.$refs.addRoleFirstInput.focus()
              })
            }
          },
        },
        methods: {
          // 获取所有角色的列表
          async getRolesList() {
            const { data: res } = await this.$http.get("roles")
            if (res.meta.status !== 200) {
              return this.$message.error(res.meta.msg)
            }

            this.rolelist = res.data
            console.log(this.rolelist)
          },
          // 展示添加角色对话框
          showAddRoleDialog() {
            this.addRoleDialogVisible = true
          },
          // 点击更新添加的角色到数据库
          async addRole() {
            if (!this.roleRights.roleName.trim()) {
              return this.$message.error("请输入角色名称！")
            }
            const { data: res } = await this.$http.post("roles", this.roleRights)
            if (res.meta.status !== 201) {
              return this.$message.error(res.meta.msg)
            }
            this.$message.success("添加角色成功！")
            this.getRolesList()
            this.addRoleDialogVisible = false
          },
          // 监听添加角色对话框的关闭并做出响应
          addRoleDialogClosed() {
            this.roleRights = {
              roleName: "",
              roleDesc: ""
            }
            this.$refs.addRoleRef.resetFields()
            this.getRolesList()
          },

        //展示删除角色的提示框
        async deleteRole(role) {
          const confrimResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch((err) => err)
          if (confrimResult !== "confirm") {
            this.$message({
            type: 'info',
            message: '已取消删除'
          })
          } 
          const { data: res} = await this.$http.delete(`roles/${role.id}`)
          if (res.meta.status !== 200) {return this.$message.error(res.meta.msg)}
          this.$message.success("删除角色成功！")
          this.getRolesList()
          },
      
          // 展示编辑权限的对话框
          showEditRightDialog(role) {
            console.log(role);
            this.editRightDialogVisible = true
            this.roleId = role.id
            this.roleRights.roleName = role.roleName
            this.roleRights.roleDesc = role.roleDesc
            console.log(this.roleRights)
            console.log(this.roleId)
          },
          // 点击为角色保存编辑后的权限
          async editRights() {
            if (!this.roleRights.roleName.trim()) {
              return this.$message.error("请输入测试角色的名称")
            }
            const { data: res } = await this.$http.put(`roles/${this.roleId}`, this.roleRights)
            if (res.meta.status !== 200) {
              return this.$message.error(res.meta.msg)
            }
            this.$message.success("编辑角色信息成功！")
            this.editRightDialogVisible = false
          },

          // 监听编辑权限对话框的关闭事件
          editRightDialogClosed() {
            this.roleRights = {
              roleName: "",
              roleDesc: ""
            },
            this.$refs.editRoleRightsRef.resetFields()
            this.getRolesList()
          },

          // 根据Id删除对应的权限
          async removeRightById(role, rightId) {
            // 弹框提示用户是否要删除
            const confirmResult = await this.$confirm("此操作将永久删除该权限，是否继续？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }).catch((err) => err)
            if (confirmResult !== "confirm") {
              return this.$message.info("取消了删除！")
            }
            const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            if (res.meta.status !== 200) {
              return this.$message.error("删除权限失败！")
            }
            role.children = res.data
          },

          // 展示分配权限的对话框
          async showSetRightDialog(role) {
            this.roleId = role.id
            // 获取所有权限的数据
            const { data: res } = await this.$http.get("rights/tree")

            if (res.meta.status !== 200) {
              return this.$message.error(res.meta.msg)
            }
            
            // 把获取到的权限数据保存到data中
            this.rightslist = res.data
            // 递归获取三级节点的id
            this.getLeafKeys(role, this.defKeys)
            this.setRightDialogVisible = true
          },

          // 通过递归的方式，获取角色下所有三级权限的id，并保存到defKeys数组中
          getLeafKeys(node, arr) {
            // 如果当前node节点不包含children属性则是三级节点
            if (!node.children) {
              return arr.push(node.id)
            }
            node.children.forEach((item) => {
              this.getLeafKeys(item, arr)
            })
          },
          // 监听分配权限对话框的关闭事件
          setRightDialogClosed() {
            this.defKeys = []
          },
          // 点击为角色分配权限
          async allotRights() {
            const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
            const idStr = keys.join(",")

            const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })

            if (res.meta.status !== 200) {
              return this.$message.error(res.meta.msg)
            }
            this.$message.success("分配权限成功！")
            this.getRolesList()
            this.setRightDialogVisible = false
          },
        }
      }
    </script>

    <style lang="less" scoped>
      .el-tag {
        margin: 7px;
      }

      .bdtop {
        border-top: 1px solid #eee;
      }

      .bdbottom {
        border-bottom: 1px solid #eee;
      }

      .vcenter {
        display: flex;
        align-items: center;
      }

      .el-input {
        margin-bottom: 10px;
      }
    </style>
  </div>
</template>

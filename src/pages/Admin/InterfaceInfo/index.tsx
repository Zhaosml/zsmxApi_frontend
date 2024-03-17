import {
  addInterfaceInfoUsingPost,
  deleteInterfaceInfoUsingPost,
  listInterfaceInfoByPageUsingGet, offlineInterfaceInfoUsingPost, onlineInterfaceInfoUsingPost,
  updateInterfaceInfoUsingPost,
} from '@/services/zsmx-backend/interfaceInfoController';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';

import CreateModal from "./components/CreateModal";
import UpdateModal from "./components/UpdateModal";
import {SortOrder} from "antd/es/table/interface";

//import InterfaceInfo = API.InterfaceInfo;


// 模态框的变量在TableList组件里，所以把增删改节点都放进来
const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
    // 把参数的类型改成InterfaceInfo
  const handleAdd = async (fields: API.InterfaceInfo) => {
      const hide = message.loading('正在添加');
      try {
        // 把addRule改成addInterfaceInfoUsingPOST
        await addInterfaceInfoUsingPost({
          ...fields,
        });
        hide();
        // 如果调用成功会提示'创建成功'
        message.success('创建成功');
        // 创建成功就关闭这个模态框
        handleModalOpen(false);
        return true;
      } catch (error) {
        hide();
        message.error('创建失败' + error.message);
        return false;
      }
    };
  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
    // 把参数的类型改成InterfaceInfo
  const handleUpdate = async (fields: API.InterfaceInfo) => {
    // 如果没有选中行，则直接返回
    if(!currentRow){
      return ;
    }
    // 设置加载中的提示中为 ‘修改中’
    const hide = message.loading('修改中');
    try {
      // 调用接口时传入id和更新字段
      // 把updateRule改为updateInterfaceInfoUsingPost
      await updateInterfaceInfoUsingPost({
        id:currentRow.id,
        ...fields,
      });
      hide();
      // 如果调用成功会提示‘操作成功’
      message.success('操作成功');
      return true;
    } catch (error) {
      hide();
      // 否则提示‘操作失败’+报错信息
      message.error('操作失败'+error.message);
      return false;
    }
  };
  /**
   * 发布节点
   *
   * @param record
   */
  const handleOnline = async (record: API.IdRequest) => {
    const hide = message.loading('发布中');
    if (!record) return true;
    try {
      await onlineInterfaceInfoUsingPost({
        // 打到id就能发布数据
        id: record.id
      });
      hide();
      message.success('发布成功');
      // 发布成功自动刷新表单
      actionRef.current?.reload();
      return true;
    } catch (error) {
      hide();
      message.error('发布失败',error.message);
      return false;
    }
  };
  /**
   * 下线接口
   *
   * @param record
   */
  const handleOffline = async (record: API.IdRequest) => {
    const hide = message.loading('下线中');
    if (!record) return true;
    try {
      await offlineInterfaceInfoUsingPost({
        // 打到id就能发布数据
        id: record.id
      });
      hide();
      message.success('下线成功');
      // 发布成功自动刷新表单
      actionRef.current?.reload();
      return true;
    } catch (error) {
      hide();
      message.error('下线失败',error.message);
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param record
   */
  const handleRemove = async (record: API.InterfaceInfo) => {
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
      await deleteInterfaceInfoUsingPost({
        // 打到id就能删除数据
        id: record.id
      });
      hide();
      message.success('删除成功');
      // 删除成功自动刷新表单
      actionRef.current?.reload();
      return true;
    } catch (error) {
      hide();
      message.error('删除失败',error.message);
      return false;
    }
  };

  const columns: ProColumns<API.InterfaceInfo>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      tip: 'index',
      hideInForm: true,
    },
    {
      title: '接口名称',
      dataIndex: 'name',
      valueType: 'text',
      formItemProps: {
        rules: [
          {
            //必填项
            required: true,
            //不设置提现信息，就默认提示”请输入“+title
            //message:"阿巴阿巴"
          },
        ],
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'text',
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      valueType: 'text',
    },
    {
      title: 'url',
      dataIndex: 'url',
      valueType: 'text',
    },
    {
      title: '响应头',
      dataIndex: 'requestParams',
      valueType: 'jsonCode',
    },
    {
      title: '响应头',
      dataIndex: 'responseHeader',
      valueType: 'jsonCode',
    },
    {
      title: '请求头',
      dataIndex: 'requestHeader',
      valueType: 'jsonCode',
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '开启',
          status: 'Processing',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
        record.status === 0 ? (
          <a
            key="Online"
            onClick={() => {
              handleOnline(record);
            }}
          >
            发布
          </a>
        ) : null,
        record.status === 1 ? (
          <Button type="text" danger key="Offline"
            onClick={() => {
              handleOffline(record);
            }
          }
          >下线</Button>) : null,

        <Button type="text" danger key="config"
                onClick={() => {
                  handleRemove(record);
                }
                }
        >删除</Button>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        // 列表返回值
        request={async (
          params, sort: Record<string, SortOrder>, filter: Record<string, (string | number)[] | null>,) =>
        {
          const res: any = await listInterfaceInfoByPageUsingGet({
            ...params,
          });
          if (res?.data) {
            return {
              data: res?.data.records || [],
              success: true,
              total: res.data.total,
            };
          } else {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
              <span>
                服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)} 万
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}

      <UpdateModal
        // 要传递 columns ，不然修改模态框没有表单项
        columns={columns}
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        // 要传递的信息改成visible
        visible={updateModalOpen}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
      {/* 创建一个CreateModal组件，用于在点击新增按钮时弹出 */}
      <CreateModal
        columns={columns}
        // 当取消按钮被点击时,设置更新模态框为false以隐藏模态窗口
        onCancel={() => {
          handleModalOpen(false);
        }}
        // 当用户点击提交按钮之后，调用handleAdd函数处理提交的数据，去请求后端添加数据(这里的报错不用管,可能里面组件的属性和外层的不一致)
        onSubmit={(values) => {
          handleAdd(values);
        }}
        // 根据更新窗口的值决定模态窗口是否显示
        visible={createModalOpen}
      />
    </PageContainer>
  );
};
export default TableList;

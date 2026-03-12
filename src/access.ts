/**
 * @see https://umijs.org/docs/max/access
 * 严谨权限定义：基于 API 文档 5.1 的 Role 模型进行判定
 */
export default (
  initialState: { currentUser?: API.CurrentUser } | undefined,
) => {
  const { currentUser } = initialState ?? {};

  return {
    // 只有角色为 ADMIN 的用户才能看到管理菜单
    canSeeAdmin: currentUser && currentUser.role === 'ADMIN',
    // 如果需要，可以定义更多细颗粒度权限
    canSeeResident: currentUser && currentUser.role === 'RESIDENT',
  };
};

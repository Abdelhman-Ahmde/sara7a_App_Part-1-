// تحديد جنس المستخدم
export const genderEnum = {
    Male: 0,
    Female: 1,
}
// تحديد دور الشخص في المنصة لتطبيق الصلاحيات
export const roleEnum = {
    Admin: 0,
    User: 1,
}
// تحديد مستوى التوقيع (Signature) المناسب لنوع الحساب
export const signatureEnum = {
    Admin: 0,
    User: 1,
}
// تحديد نوع التوكن
export const tokenTypeEnum = {
    Access: 0,
    Refresh: 1,
}
// تحديد طريقة إنشاء الحساب، هل هو حساب من النظام أم من طرف خارجي
export const providerEnum = {
    System: 0,
    Google: 1,
}
// تحديد حالة المستخدم
export const logoutTypeEnum = {
    Logout: "Logout",
    LogoutAll: "LogoutFromAllDevices",
}

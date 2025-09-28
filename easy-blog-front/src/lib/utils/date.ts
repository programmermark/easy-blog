/**
 * 格式化日期为文本
 * @param date 日期字符串或Date对象
 * @returns 格式化后的日期文本
 */
export function formatDateToText(date: string | Date): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInDays > 0) {
    return `${diffInDays}天前`;
  } else if (diffInHours > 0) {
    return `${diffInHours}小时前`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes}分钟前`;
  } else {
    return '刚刚';
  }
}

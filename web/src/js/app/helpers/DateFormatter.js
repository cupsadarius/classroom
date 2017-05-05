export class DateFormatter {
  formatDate(date) {
    if (!date) {
      return '';
    }
    const monthNames = [
      'January', 'February', 'March',
      'April', 'May', 'June', 'July',
      'August', 'September', 'October',
      'November', 'December',
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return `${day} ${monthNames[monthIndex]} ${year}`;
  }

  formatDateShort(date) {
    if (!date) {
      return '';
    }
    const day = date.getDate();
    const monthIndex = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}-${monthIndex < 10 ? `0${monthIndex}` : monthIndex}-${day < 10 ? `0${day}` : day}`;
  }
}

export default new DateFormatter();

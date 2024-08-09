
  exports.formatDateToDayMonthYear = (dateString) => {
    const date = new Date(dateString);
  
    // Extract the day, month, and year in local time
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based, so add 1
    const year = date.getFullYear();
  
    // Format them as a string "day-month-year"
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };
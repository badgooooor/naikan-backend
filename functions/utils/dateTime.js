const getToday = () => {
  let today = new Date()
  let year = today.getFullYear().toString()
  let rawMonth = (today.getMonth() + 1)
  let month = (rawMonth > 10) ? rawMonth.toString() : ("0" + rawMonth.toString())  
  let rawDate = today.getDate()
  let date = (rawDate > 10) ? rawDate.toString() : ("0" + rawDate.toString())
  
  return parseInt(year+month+date)
}

const queryRangeYear = (year) => {
  let start = parseInt(year+"0101")
  let end = parseInt(year+"1231")
  
  return [['date', '>=', start], ['date', '<=', end]]
}

const queryRangeMonth = (year, month) => {
  let ConvertedMonth = (month > 10) ? (month.toString()) : ("0" + month.toString())
  let start = parseInt(year+ConvertedMonth+"01")
  let end = parseInt(year+ConvertedMonth+"31")

  return [['date', '>=', start], ['date', '<=', end]]
}

module.exports = {
  getToday, queryRangeYear, queryRangeMonth
}
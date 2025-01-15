document.addEventListener('DOMContentLoaded', () => {
  const dateTimeElement = document.getElementById('current-datetime')
  const updateDateTime = () => {
      const now = new Date()
      const options = { timeZone: 'Asia/Manila', hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: 'long', year: 'numeric' }
      dateTimeElement.textContent = now.toLocaleString('en-PH', options)
  }
  setInterval(updateDateTime, 1000)
  updateDateTime()
})
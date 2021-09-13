$(function() {
  fetch(`${window.location.origin}/api/v1/metrics`)
  .then(response => response.json())
  .then(response => {
    $('#count_links_checked').removeClass('animate-pulse').text(response.data.count_links_checked.toLocaleString())
    $('#count_links_safe').removeClass('animate-pulse').text(response.data.count_links_safe.toLocaleString())
    $('#count_links_malware').removeClass('animate-pulse').text(response.data.count_links_malware.toLocaleString())
    $('#count_links_adult_content').removeClass('animate-pulse').text(response.data.count_links_adult_content.toLocaleString())
    $('#most_recently_checked_links').removeClass('animate-pulse')
    $('#most_recently_checked_links tbody').html('')
    response.data.most_recently_checked.forEach(link => {
      let linkDetail = link.link
      let typeDetails
      if (link.type === 'malware') {
        linkDetail = linkDetail.split('').map((char, index) => index % 3 === 0 ? '*' : char).join('')
        typeDetails = 'Malware <i class="fas fa-spider text-red-600"></i>'
      } else if (link.type === 'adult_content') {
        linkDetail = linkDetail.split('').map((char, index) => index % 3 === 0 ? '*' : char).join('')
        typeDetails = 'Adult Content <i class="fas fa-exclamation-triangle text-yellow-600"></i>'
      } else {
        typeDetails = 'Safe <i class="fas fa-check text-green-600"></i>'
      }
      $('#most_recently_checked_links tbody').append(`
        <tr>
          <td class="px-6 py-4 text-xs font-semibold break-all">${linkDetail}</td>
          <td class="px-6 py-4 text-center">${typeDetails}</td>
        </tr>
      `)
    })
    $('#most_recently_checked_links tr:odd').addClass('bg-blueGray-100')
    $('#most_recently_checked_links tr:event').addClass('bg-white')
  })

  $('#link').on('input', event => {
    $('#link_status').removeClass('text-green-600 text-red-600').addClass('hidden')
    $('#link_check').prop('disabled', false)
    if ($(event.currentTarget).val().length > 0) {
      $('#link_clear').removeClass('hidden')
    } else {
      $('#link_clear').addClass('hidden')
    }
  })

  $('#link').on('keypress', event => {
    if (event.which === 13) {
      $('#link_check:enabled').trigger('click')
    }
  })

  $('#link_clear').on('click', event => {
    $(event.currentTarget).addClass('hidden')
    $('#link').val('')
    $('#link_status').removeClass('text-green-600 text-red-600').addClass('hidden')
  })

  $('#link_check').on('click', event => {
    $('#link').prop('readonly', true)
    $(event.currentTarget).html('<i class="animate-spin fas fa-circle-notch"></i>')
    $(event.currentTarget).prop('disabled', true)
    $(event.currentTarget).addClass('opacity-50')
    let link =  $('#link').val().trim()
    const urlParts = link.split(':')
    if (urlParts.length === 1) {
      link = `https://${link}`
      $('#link').val(link)
    }
    fetch(`${window.location.origin}/api/v1/links`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        link: $('#link').val().trim()
      })
    })
    .then(response => {
      if (response.status === 500) {
        if (window.confirm('Something went wrong.\nWould you like to refresh the page?')) {
          location.reload()
          return
        }
      }

      if (response.status === 429) {
        if (window.confirm('Too many request.\nWould you like to refresh the page?')) {
          location.reload()
          return
        }
      }
      return response
    })
    .then(response => response.json())
    .then(response => {
      if (response.success) {
        $('#link_status')
          .removeClass('hidden')
          .addClass('text-green-600')
          .text(response.message)
        return
      }

      if (response.status === 422) {
        $('#link').val(response.data.link)
        $('#link_status')
          .removeClass('hidden')
          .addClass('text-red-600')
          .text(response.data.errors.link)
        return
      }
    })
    .finally(() => {
      $('#link').prop('readonly', false)
      $(event.currentTarget).text('Check')
      $(event.currentTarget).removeClass('opacity-50')
    })
  })
})

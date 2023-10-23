Swal.fire({
    title: 'Are you sure?',
    text: "The government may be watching.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'My eyes are open.'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Enter',
        'You have been warned.',
        'success'
      )
    }
  })
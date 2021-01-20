
// window.onload = function() {
 
    const bookmarks = document.getElementsByClassName('bookmark');
    [...bookmarks].forEach(bookmark => {
        bookmark.style.cursor = 'pointer'
        bookmark.addEventListener('click', function(e) {
            const target = e.target.parentElement
            const headers = new Headers()
            console.log(target.dataset.post)
            headers.append('Accept', 'Application/JSON')
            const req = new Request(`/api/bookmarks/${target.dataset.post}`, {
                method: 'GET',
                headers,
                mode: 'cors'
            })

            fetch(req)
                .then(res => res.json())
                .then(data => {
                    if(data.bookmark) {
                        target.innerHTML = `<i class="fas fa-bookmark"></i>`
                    } else {
                        target.innerHTML = `<i class="far fa-bookmark"></i>`
                    }
                })
                .catch(e => {
                    console.log(e.response.data)
                    alert(e.response.data.error)
                })
        })
    })
// }
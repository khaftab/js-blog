
// window.onload = function() {
    const likeBtn = document.getElementById('likeBtn')
    const dislikeBtn = document.getElementById('dislikeBtn')

    likeBtn.addEventListener('click', function(e) {
        const postId = e.target.dataset.post
        requestLikeDislike('likes', postId)
            .then(res => res.json())
            .then(data => {
                let likeText = data.liked ? 'Liked' : 'Like'
                likeText = likeText + ` ( ${data.totalLikes} )`
                let dislikeText = `Dislike ( ${data.totalDislikes} )`
                
                likeBtn.innerHTML = likeText
                dislikeBtn.innerHTML = dislikeText
            })
            .catch(e => console.log(e))
    })

    
    dislikeBtn.addEventListener('click', function(e) {
        const postId = e.target.dataset.post
        requestLikeDislike('dislikes', postId)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                let dislikeText = data.disliked ? 'Disliked' : 'Dislike'
                dislikeText = dislikeText + ` ( ${data.totalDislikes} )`
                let likeText = `Like ( ${data.totalLikes} )`
                
                dislikeBtn.innerHTML = dislikeText
                likeBtn.innerHTML = likeText
              
               
            })
            .catch(e => console.log(e))
    })


    function requestLikeDislike(type, postId) {
        const headers = new Headers()
        headers.append('Accept', 'Application/JSON')
        headers.append('Content-Type', 'Application/JSON')

        const req = new Request(`/api/${type}/${postId}`, {
            method: 'GET',
            headers,
            mode: 'cors'
        })

        return fetch(req)
    }
// }
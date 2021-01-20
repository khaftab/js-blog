

window.onload = function () {
    const comment = document.getElementById('comment')
    const commentHolder = document.getElementById('comment-holder')

    

    const commentFunction = () => {
        comment.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                if (e.target.value) {
                    const postId = comment.dataset.post
                    const data = {
                        body: e.target.value
                    }

                    generateRequest(`/api/comments/${postId}`, 'POST', data)
                        .then(res => res.json())
                        .then(data => {
                            const commentElement = createComment(data)
                            commentHolder.insertBefore(commentElement, commentHolder.children[0])
                            e.target.value = ''
                        })
                        .catch(e => console.log(e))
                } else {
                    alert('Please enter a valid comment')
                }
            }

        })
    }

    if (comment) {
        commentFunction()
    }

    // in the dashboard/comments page user is not allowed to comment but he can reply. Because of this that page does consists the comment id in html. And we are listing an event on null object so it gives error. Thats why we checking wheather we are getting the comment id and execute the comment function.

    commentHolder.addEventListener('keypress', function (e) {

        if (commentHolder.hasChildNodes(e.target)) {
            if (e.key === 'Enter') {
                const commentId = e.target.dataset.comment
                const value = e.target.value

                if (value) {
                    const data = {
                        body: value
                    }

                    generateRequest(`/api/comments/replies/${commentId}`, 'POST', data)
                        .then(res => res.json())
                        .then(data => {
                            const replyElement = createReplyElement(data)
                            const parent = e.target.parentElement.parentElement // selecting replies div
                            parent.insertBefore(replyElement, parent.lastElementChild) // insering before the input tag
                            e.target.value = ''
                        })
                        .catch(e => console.log(e))
                }
            }
        }
    })

    function generateRequest(url, method, body) {
        const headers = new Headers
        headers.append('Accept', 'Application/JSON')
        headers.append('Content-Type', 'Application/JSON')

        const req = new Request(url, {
            method,
            headers,
            body: JSON.stringify(body),
            mode: "cors"
        })

        return fetch(req)
    }
}

function createComment(comment) {
    const innerHTML = `
    <img src="${comment.user.profilePics}"  alt="Profile Pics" class="rounded-circle mx-3 my-3" style="width: 40px;">
    <div class="media-body my-3">
        <p>${comment.body}</p>
    
        <div class="my-3">
            <input type="text" name="reply" placeholder="Press enter to reply" data-comment="${comment._id}" class="form-control">
        </div>
    </div>
    `
    const div = document.createElement('div')
    div.innerHTML = innerHTML
    div.className = 'media border'
    return div
}

function createReplyElement(data) {
    const innerHTML = `
    <img src="${data.profilePics}" alt="Profile Pics" class="align-self-start mr-3 rounded-circle" style="width: 40px;">
    <div class="media-body">
        <p>${data.body}</p>
    </div>
    `

    const div = document.createElement('div')
    div.className = 'media mt-3'
    div.innerHTML = innerHTML
    return div
}

// In here we just using this innerhtml to render the dom with the latest data. Though it is not mandetory as we are saving this comments in the database.
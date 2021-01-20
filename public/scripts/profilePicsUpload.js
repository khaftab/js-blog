window.onload = function () {
    const baseCropping = $("#cropped-image").croppie({
        viewport: {
            width: 200,
            height: 200,
        },
        boundary: {
            width: 300,
            height: 300,
        },
        showZommer: true,
    });

    const readableFile = function (file) {
        let reader = new FileReader();
        reader.onload = function (event) {
            console.log(baseCropping)
            baseCropping
                .croppie("bind", {
                    url: event.target.result,
                })
                .then(() => {
                    $(".cr-slider").attr({
                        min: 0.5,
                        max: 1.5,
                    });
                });
        };
        reader.readAsDataURL(file);
        console.log(file);
    };

    $("#profilePicsFile").on("change", function (e) {
        if (this.files[0]) {
            readableFile(this.files[0]);
            $(".crop-modal").modal({
                backdrop: "static",
                keyboard: false,
            });
        }
    });

    $("#cancel-cropping").on("click", function () {
        $(".crop-modal").modal("hide");
    });



    $("#upload-image").on("click", function () {
        baseCropping
            .croppie("result", "blob")
            .then((blob) => {
                const formData = new FormData();
                const file = document.getElementById("profilePicsFile").files[0];
                const name = generateFileName(file.name);

                formData.append("profilePics", blob, name);

                const headers = new Headers();
                headers.append("Accept", "Application/JSON");

                const req = new Request("/uploads/profile-pics", {
                    method: "POST",
                    headers,
                    mode: "cors",
                    body: formData,
                });

                return fetch(req)

            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                document.getElementById("profilePics").src = `${data.profilePics}`
                document.getElementById("removeProfilePics").style.display =
                    "block";

                document.getElementById("profilePicsForm").reset();
                $(".crop-modal").modal("hide");
            });
    });
};

function generateFileName(name) {
    const types = /(.jpeg|.jpg|.png|.gif)/;
    return name.replace(types, ".png");
}

// remove profile pics

$('#removeProfilePics').on('click', function () {
    const req = new Request('/uploads/profile-pics', {
        method: 'DELETE',
        mode: 'cors'
    })

    fetch(req)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            document.getElementById("removeProfilePics").style.display = "none";
            document.getElementById("profilePics").src = `${data.profilePics}`
            document.getElementById("profilePicsForm").reset();
        })
        .catch(e => {
            console.log(e)
            alert('Server error occoured')
        })

})
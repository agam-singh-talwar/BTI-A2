/***********************************************************************************
* BTI425 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
*
*  Name: Agam Singh Talwar Student ID: 104495213 Date: Feb 2, 23
*  Cyclic Link: 
*
********************************************************************************/
// variable for number of pages
let page=1;
// const for number of movies per page
const perPage = 10;

// functions

function loadMovieData(title = null) {
    let url;
    const div =document.querySelector(".pagination");
    var d_none ="d-none";
    if(title)
    {
        page=1;
        url=`https://tasty-toga-bull.cyclic.app/api/movies?page=${page}&perPage=${perPage}&title=${title}`;
        div.classList.add(d_none);
    }
    else
    {
        url=`https://tasty-toga-bull.cyclic.app/api/movies?page=${page}&perPage=${perPage}`;
        div.classList.remove(d_none);
    }
    fetch(url)
    .then((res)=>res.json())
    .then((data)=>{
        let postRows = `
    ${data.data.map(movie => (
    `<tr data-id=${movie._id}>
        <td>${movie.year}</td>
        <td>${movie.title}</td>
        <td> ${movie.plot?movie.plot:"N/A"} </td>
        <td> ${movie.rated?movie.rated:"N/A"} </td>
        <td>${Math.floor(movie.runtime/60) + ":"+ (movie.runtime % 60).toString().padStart(2,'0')}</td>
    </tr>`
    )).join('')}
`;
    document.querySelector('tbody').innerHTML = postRows;
    document.querySelector('#current-page').innerHTML=page;

    document.querySelectorAll('#moviesTable tbody tr').forEach((row) => {
        row.addEventListener('click',e=>{
            const id = row.getAttribute("data-id");
        fetch(`https://tasty-toga-bull.cyclic.app/api/movies/${id}`)
        .then(res=>res.json())
        .then(data=>{
            // data=[data];
            document.querySelector('.modal-title').textContent=data.Message.title;
            let postRows = `
            <img class="img-fluid w-100" src=${data.Message.poster?data.Message.poster:" "}><br><br>
            <strong>Directed By:</strong> ${data.Message.directors} <br><br>
            <p>${data.Message.fullplot}</p>
            <strong>Cast:</strong> ${data.Message.cast != null?data.Message.cast.join(', ' ):"N/A"} <br><br>
            <strong>Awards:</strong> ${data.Message.awards.text} <br>
            <strong>IMDB Rating:</strong> ${data.Message.imdb.rating} (${data.Message.imdb.votes} votes)
                `;
            document.querySelector('.modal-body').innerHTML = postRows;

            let modal = new bootstrap.Modal(document.querySelector('#detailsModal'),{backdrop: "static", keyboard: false});
            modal.show();
        })
        })
    });
    })
    .catch(err=>{console.log(err)});

};



// Execute when the DOM is 'ready'
document.addEventListener('DOMContentLoaded', function () {
    loadMovieData();
    // button for next previous page
    document.querySelector('#previous-page').addEventListener('click',(e)=>{
        page!=1?page--:page;
        loadMovieData();
    });
    //button for next page
    document.querySelector('#next-page').addEventListener('click',(e)=>{
        page++;
        loadMovieData();
    });
    // Submit Form/search box
    document.querySelector('#searchForm').addEventListener('submit',((e)=>{
        e.preventDefault();
        if(document.querySelector('#title').value!=null){
            loadMovieData(document.querySelector('#title').value);
        };
    }))
    // Clear form/search box
    document.querySelector('#clearForm').addEventListener('click',(e=>{
        document.getElementById('title').value='';
        loadMovieData();
    }));
    });

let text = 'interlinked. within cells interlinked. where is the place in the world you feel the safest? within.'
let textArr = text.split(' ').slice(0, 16)

const url = 'https://en.wikipedia.org/w/api.php'

// big boi
$(document).ready(function() {
    display(textArr)

    $('#text').on('click', 'span', function(){
        let word = $(this).text()
        let query = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\"\'—]/g,"").toLowerCase()
        let position = 15 - $(this).parent().nextAll().length //max = 15

        $('#source').empty()
        $('#source').append(`<span>en route.</span>`)

        request(url, query, position)
    })
})

// put word in box
function display(textArray) {
    $('.box').each(function(i) {
        $(this).append(`<span>${textArray[i]}</span>`)
    })
}

// configure response text into a 16-word array and display it
// position has max value of 15
function configureResponse(response, query, position) {
    let responseTextArr = response.split(' ')
    let searchTextArr = []
    let resultTextArr = []
    responseTextArr.forEach(element => {
        searchTextArr.push(element.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\"\'—]/g,"").toLowerCase())
    });

    // index of query word in the wikipedia article
    let index = searchTextArr.indexOf(query)
    console.log(`index ${index}`)
    console.log(`position ${position}`)

    if (index < position) {
        if (index === -1) {
            index = 0
        }
        // fill in holes if necessary
        for (i = position - index; i > 0; i--) {
            resultTextArr.push(' ')
        }
        // start filling with words
        for (i = 0; i < 17-position; i++) {
            resultTextArr.push(responseTextArr[i])
        }
    } else if (index === position) {
        // assuming no wikipedia article has fewer than 16 words
        resultTextArr = responseTextArr.slice(0, 16)
    } else if (index + 15 > responseTextArr.length - 1) {
        resultTextArr = responseTextArr.slice(index - position, responseTextArr.length)
        for (i = index + 16 - responseTextArr.length; i > 0; i--) {
            resultTextArr.push(' ')
        }
    } else {
        resultTextArr = responseTextArr.slice(index - position, index - position + 16)
    }
    display(resultTextArr)
}

// HTTP get request
function request(url, query, position) {
    $.get(
        url,
        {
            action : 'query',
            format : 'json',
            list : 'search',
            srsearch : query,
            srlimit : 5,
            srwhat : 'text'
        },
        function (data) {
            let randIndex = Math.floor(Math.random() * data.query.search.length)
            let pageid = data.query.search[randIndex].pageid
            
            $.get(
                url,
                {
                    action : 'query',
                    format : 'json',
                    prop : 'extracts',
                    pageids : pageid,
                    formatversion : 2,
                    explaintext : 1
                },
                function (data) {
                    $('div.box').empty()
                    let page = data.query.pages[0]
                    configureResponse(page.extract, query, position)

                    $('#source').empty()
                    $('#source').append(`<a href="https://en.wikipedia.org/?curid=${pageid}" target="_blank">https://en.wikipedia.org/?curid=${pageid}</a>`)
                },
                'jsonp'
            )
        },
        'jsonp'
    )
}

// flashlight
function update(e){
    var x = e.clientX;
    var y = e.clientY;
  
    document.getElementById('shade').style.setProperty('--X', x + 'px');
    document.getElementById('shade').style.setProperty('--Y', y + 'px');
  }
  
  document.getElementById('shade').style.setProperty('--X', 0 + 'px');
  document.getElementById('shade').style.setProperty('--Y', 0 + 'px');
  
  document.addEventListener('mousemove', update);
  document.addEventListener('touchmove', update);
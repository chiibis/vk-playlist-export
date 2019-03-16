function downloadM3UFile(filename, data) {
    let blob = new Blob([data], {type: "text/plain;charset=utf-8"});
    saveAs(blob, filename + ".m3u");
}

function getSongsInfoFromHtml() {
    let songsArr = [];
    let songsElems = $('.audio_row__inner');

    songsElems.each(function(index, el){

        let songEl = $(el);

        let performerText = songEl.find('.artist_link').text();
        let title = songEl.find('._audio_row__title_inner').text();
        let duration = songEl.find('._audio_row__duration').text();

        let durationSplited = duration.split(':');
        let durationInSeconds = parseInt(durationSplited[0]) * 60 + parseInt(durationSplited[1]);

        let songObj = {
            performer: performerText,
            title: title,
            length: durationInSeconds,
        };

        songsArr.push(songObj)
    });

    return songsArr;
}

function convertSongsToM3U(songsArr) {
    return JSON.stringify(songsArr)
}


function exportButtonClick() {
    // console.log('VK Extension:: exportButtonClick()');

    let songs = getSongsInfoFromHtml();
    let blob = convertSongsToM3U(songs);

    //todo: get id from page and pass it as filename
    downloadM3UFile('debug_playlist', blob)
}


function addExportIcon() {
    // console.log('VK Extension:: addExportIcon()');

    let uiTabsHeader = $('.ui_tabs_header');
    let exportButton = $('<button/>');

    exportButton.addClass('audio_page__main_tabs_btn').addClass('audio_page__export_playlist_btn');
    exportButton.attr('title', 'Экспортнуть плейлист');

    exportButton.click(exportButtonClick);
    uiTabsHeader.append(exportButton)
}

document.addEventListener('DOMContentLoaded',function(){
    // console.log('VK Extension:: DOM content loaded');
    addExportIcon();
});

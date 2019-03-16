function downloadM3UFile(filename, data) {
    let blob = new Blob([data], {type: "text/plain", endings: 'transparent'});
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
            duration: durationInSeconds,
        };

        songsArr.push(songObj)
    });

    return songsArr;
}

function convertSongsArrToM3U(songsArr) {

    // We have to get smth like this in file
    //
    // #EXTM3U
    // #EXTINF:260,Django Django - Reflections
    // #EXTINF:214,Cold War Kids - Love Is Mystical

    const NEW_LINE_SYM = '\r\n';
    const M3U_SONG_PREFIX = '#EXTINF:';
    const M3U_PLAYLIST_PREFIX = '#EXTM3U';

    let resultText = M3U_PLAYLIST_PREFIX + NEW_LINE_SYM;

    for (let song of songsArr) {
        let resultSongLine = song.duration + ',' + song.performer + ' - ' + song.title;
        resultText += M3U_SONG_PREFIX + resultSongLine + NEW_LINE_SYM;
    }

    return resultText
}


function exportButtonClick() {
    // console.log('VK Extension:: exportButtonClick()');

    let songs = getSongsInfoFromHtml();
    let blob = convertSongsArrToM3U(songs);

    const userId = /\d+/.exec(window.location.href)[0];
    const songsAmount = songs.length;

    const filename = 'playlist_' + userId + '_' + songsAmount;

    downloadM3UFile(filename, blob)
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

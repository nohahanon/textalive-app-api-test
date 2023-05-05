/* 1. textalive-app-apiの処理*/

const { Player } = TextAliveApp;

// TextAlive Player を初期化
const player = new Player({
    app: { token: "y6RFZQdvGPRno4XK" },
    mediaElement: document.querySelector("#media"),
    mediaBannerPosition: "bottom right"
});

const overlay = document.querySelector("#overlay");
const lyricsText = document.querySelector("#text");
const artistSpan = document.querySelector("#artist span");
const songSpan = document.querySelector("#song span");
let b, c;

// 単語が発声されていたら #text に表示する
const animateWord = function (now, unit) {
    if (unit.contains(now)) {
        lyricsText.textContent = unit.text;
        console.log(unit);
    }
};

player.addListener({
    // TextAlive App が初期化されたときに呼ばれる
    onAppReady(app) {
        if (app.managed) {
            document.querySelector("#control").className = "disabled";
        } else {
            /* 再生・一時停止ボタン */
            document.querySelector("#control > a#play").addEventListener("click", (e) => {
                e.preventDefault();
                if (player) {
                    if (player.isPlaying) {
                        player.requestPause();
                    } else {
                        player.requestPlay();
                    }
                }
                return false;
            });

            /* 停止ボタン */
            document.querySelector("#control > a#stop").addEventListener("click", (e) => {
                e.preventDefault();
                if (player) {
                    player.requestStop();
                }
                return false;
            });
        }
        if (!app.songUrl) {
            document.querySelector("#media").className = "disabled";

            // king妃jack躍 / 宮守文学 feat. 初音ミク
            // https://developer.textalive.jp/events/magicalmirai2023/#snippets
            player.createFromSongUrl("https://piapro.jp/t/ucgN/20230110005414", {
                video: {
                    beatId: 4267297,
                    chordId: 2405019,
                    repetitiveSegmentId: 2405019,
                    lyricId: 56092,
                    lyricDiffId: 9636
                }
            });
        }
    },
    // 楽曲が変わったら呼ばれる
    onAppMediaChange() {

    },
    // 再生コントロールができるようになったら呼ばれる 
    onVideoReady(video) {
        // オーバーレイを剥がす
        overlay.className = "disabled";
        // 再生ボタンと停止ボタンのクラスを変更
        document.querySelector("#control > a#play").className = "";
        document.querySelector("#control > a#stop").className = "";
        // メタデータを表示する
        artistSpan.textContent = player.data.song.artist.name;
        songSpan.textContent = player.data.song.name;

        let w = player.video.firstWord;
        while (w) {
            w.animate = animateWord;
            w = w.next;
        }
    },
    // 音源の再生準備が完了した時に呼ばれる
    onTimerReady() {

    },
    // 再生位置の情報が更新されたら呼ばれる
    onTimeUpdate(position) {
        console.log();
    },
    // 楽曲の再生が始まったら呼ばれる
    onPlay() {

    },
    // 再生が一時停止されたときに呼ばれる
    onPause() {
        lyricsText.textContent = "";
    },
    // 再生が停止されたときに呼ばれる
    onStop() {
        lyricsText.textContent = "";
    }
});

/* 2. theree.jsの処理 */

// ページの読み込みを待つ
// window.addEventListener('DOMContentLoaded', init);

// function init() {
//     // サイズを指定
//     const width = window.innerWidth;
//     const height = window.innerHeight;

//     // レンダラーを作成
//     const canvasElement = document.querySelector('#myCanvas');
//     const renderer = new THREE.WebGLRenderer({
//         canvas: canvasElement,
//     });
//     renderer.setSize(width, height);

//     // シーンを作成
//     const scene = new THREE.Scene();

//     // カメラを作成
//     const camera = new THREE.PerspectiveCamera(45, width / height);
//     // カメラの初期座標を設定
//     camera.position.set(0, 0, 1000);

//     // カメラコントローラーを作成
//     const controls = new THREE.OrbitControls(camera, canvasElement);

//     // 形状とマテリアルからメッシュを作成します
//     const mesh = new THREE.Mesh(new THREE.BoxGeometry(300, 300, 300), new THREE.MeshNormalMaterial());
//     scene.add(mesh);

//     tick();

//     // 毎フレーム時に実行されるループイベントです
//     function tick() {
//         // レンダリング
//         renderer.render(scene, camera);
//         requestAnimationFrame(tick);
//     }
// }
import React, { useState, useEffect, useCallback, useRef, createContext, useContext, useMemo } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const APP_DICTIONARY = {
    vi: {
        trending: "Anime Mới", movies_tab: "Movie Mới", explore: "Khám Phá", search: "Tìm kiếm", library: "Tài khoản",
        all: "Tất cả", movies: "Anime Movie", entertainment: "Giải trí",
        views: "Lượt xem", likes: "Thích", dislikes: "Không thích", comments: "Bình luận", share: "Chia sẻ", settings: "Cài đặt", language: "Ngôn ngữ", theme: "Giao diện", about: "Giới thiệu",
        theme_sakura: "Manga Light", theme_cyber: "Manga Dark", theme_moe: "Moe White", theme_moe_black: "Moe Black", save: "Lưu", cancel: "Hủy",
        login_prompt: "Đăng nhập để đồng bộ dữ liệu phim.", logout: "Đăng xuất", no_data: "Trống trơn... Không có Waifu nào ở đây cả!", loading: "Đang tải dữ liệu...", search_placeholder: "Tìm kiếm...", back: "Quay lại",
        account_title: "Hồ sơ Otaku", my_favorites: "Phim Đã Lưu", my_history: "Lịch sử Xem",
        vph: "View/Giờ", er: "Tỷ lệ tương tác", channel_analytics: "Phân tích Kênh", top_comment: "Bình Luận Nổi Bật", total_comments: "Tổng bình luận",
        total_subs: "Người đăng ký", total_views: "Tổng lượt xem", total_videos: "Tổng video", avg_views: "View TB/video", video_vs_avg: "Hiệu suất Tập phim",
        yume_score: "Yume Index", yume_desc: "Đánh giá sức mạnh lan truyền", desc_show: "Hiện", desc_hide: "Ẩn",
        share_yume: "Copy báo cáo YumeStats", share_yt: "Copy link YouTube gốc", watch_yt: "Xem trên YouTube", copied: "Đã Copy!",
        seo_tags: "HASHTAG", copy_tags: "Copy tất cả", rank: "Hạng", view_to_sub: "Tỷ lệ View/Sub", view_to_sub_desc: "Số view cần để đổi lấy 1 Sub", 
        channel_top_videos: "Phổ Biến Gần Đây", channel_latest_videos: "Tập Mới Nhất",
        estimated: "ước tính", coming_soon: "Tính năng đang phát triển", channel_ui: "Bảng Xếp Hạng Kênh", back_home: "Về Trang chủ",
        refresh_confirm: "Làm mới lại dữ liệu từ máy chủ gốc?", refresh_success: "Đã làm mới dữ liệu!",
        tab_general: "Cài đặt chung", tab_about: "Thông tin", app_desc: "YumeStats Pro là công cụ phân tích dữ liệu đa nền tảng, thiết kế riêng cho cộng đồng Anime/Manga.", terms: "Điều khoản sử dụng: Dữ liệu được cung cấp thông qua API bản quyền bên thứ ba.",
        tab_trending: "Tập Mới (Timeline)", tab_hot: "YumeRank (Thịnh Hành)", trending_desc: "Danh sách 50 tập Anime mới ra mắt", hot_desc: "Top 20 xếp hạng theo thuật toán YumeRank",
        vph_desc: "Số lượt xem tăng lên trong mỗi giờ", er_desc: "Phần trăm tương tác trên tổng lượt xem", dislike_est: "Số lượng dislike ước tính",
        chart_speed: "TỐC ĐỘ", chart_power: "SỨC MẠNH", chart_base: "ĐỘ HẤP DẪN", engagement_ratio: "Tỷ lệ Tương tác", view_compare: "So sánh Lượt xem Top 5", latest_compare: "So sánh View 5 Tập Mới",
        recommended: "Có thể bạn sẽ thích (Cùng Series)", total_series_views: "Tổng View Series", click_to_expand: "Bấm để xem các tập",
        search_results: "Kết quả tìm kiếm",
        admin_panel: "Bảng Điều Khiển Admin", sync_init: "Khởi tạo Database", sync_delta: "Cập Nhật Tập Mới",
        add_video: "Thêm Video", delete: "Xóa", input_yt_link: "Nhập Link/ID YouTube...",
        maintenance: "Hệ thống Đang Bảo Trì", maintenance_desc: "Tab Khám Phá hiện đang được Admin nâng cấp. Vui lòng quay lại sau!",
        genres: "Thể loại", add_genre: "Sửa thể loại (Cách nhau dấu phẩy)", status_public: "Trạng thái: CÔNG KHAI", status_private: "Trạng thái: BẢO TRÌ (ẨN)",
        delete_series: "Xóa cả Bộ", blacklist_ask: "Bạn có muốn đưa ID này vào Blacklist để không bao giờ tự động thêm lại không?",
        watch_inapp: "Xem tại đây", watch_yt: "Xem trên YouTube", close_player: "Đóng Player",
        clear_history: "Xóa toàn bộ lịch sử", clear_favorites: "Xóa tất cả yêu thích",
        remove_item: "Xóa khỏi danh sách", confirm_clear: "Xác nhận xóa toàn bộ?",
        rename_playlist: "Đổi tên Playlist", create_playlist: "Tạo Playlist mới", playlist_name: "Tên Playlist",
        playlist_created: "Đã tạo Playlist!", playlist_exists: "Playlist đã tồn tại!",
        sync_progress: "Đang xử lý trang", full_sync_note: "Đang cào TOÀN BỘ kênh (có thể mất vài phút)...",
        add_movie: "Thêm Movie", delete_movie: "Xóa Movie", movie_admin: "Quản lý Movie",
        movies_sync_init: "Cào tất cả Movie", movies_sync_done: "Đã cào xong Movie!",
        search_hint: "VD: Kimetsu no Yaiba ss2 ep5", no_results: "Không tìm thấy kết quả phù hợp",
        fuzzy_suggestion: "Bạn có muốn tìm:", whitelist_only: "Chỉ hiển thị nội dung từ kênh chính thức",
        delete_db: "Xóa Toàn bộ Database", delete_db_confirm: "⚠️ Xóa TOÀN BỘ dữ liệu Explore? Không thể khôi phục!",
        delete_db_done: "Đã xóa database!", bulk_select: "Chọn nhiều", bulk_delete: "Xóa đã chọn",
        select_all: "Chọn tất cả", deselect_all: "Bỏ chọn tất cả", selected_count: "đã chọn",
        page_of: "trang", prev_page: "Trước", next_page: "Tiếp",
        login_required: "Cần đăng nhập", login_required_desc: "Vui lòng đăng nhập để sử dụng tính năng này.",
        tos_title: "Điều khoản sử dụng YumeStats", tos_body: "YumeStats là công cụ tra cứu thống kê anime. Dữ liệu được cung cấp qua YouTube Data API. Không sao chép hay phân phối nội dung trái phép. Bằng cách tiếp tục, bạn đồng ý với các điều khoản này.",
        tos_agree: "Đã hiểu, tiếp tục", tos_hide_day: "Ẩn trong 24 giờ",
        new_only: "Chỉ 30 ngày qua", trending_7d: "Thịnh hành 30 ngày",
        next_episodes: "Tập tiếp theo", assign_ep: "Gán SS/Tập", assign_season: "Mùa (SS)", assign_episode: "Tập (EP)",
        assign_save: "Lưu phân loại", assign_done: "Đã lưu!", movie_page: "trang phim"
    },
    en: {
        trending: "Anime", movies_tab: "New Movies", explore: "Explore", search: "Search", library: "Account",
        all: "All", movies: "Anime Movies", entertainment: "Entertainment",
        views: "Views", likes: "Likes", dislikes: "Dislikes", comments: "Comments", share: "Share", settings: "Settings", language: "Language", theme: "Theme", about: "About",
        theme_sakura: "Manga Light", theme_cyber: "Manga Dark", theme_moe: "Moe White", theme_moe_black: "Moe Black", save: "Save", cancel: "Cancel",
        login_prompt: "Login to sync anime data.", logout: "Logout", no_data: "So empty... No Waifus here!", loading: "Loading Data...", search_placeholder: "Search...", back: "Back",
        account_title: "Otaku Profile", my_favorites: "Saved Anime", my_history: "Watch History",
        vph: "Views/Hour", er: "Eng. Rate", channel_analytics: "Channel Analytics", top_comment: "Top Comment", total_comments: "Total comments",
        total_subs: "Subscribers", total_views: "Total Views", total_videos: "Total Videos", avg_views: "Avg Views/Video", video_vs_avg: "Episode Performance",
        yume_score: "Yume Index", yume_desc: "Viral potential score", desc_show: "Show", desc_hide: "Hide",
        share_yume: "Copy YumeStats Report", share_yt: "Copy Original YouTube Link", watch_yt: "Watch on YouTube", copied: "Copied!",
        seo_tags: "HASHTAG", copy_tags: "Copy All", rank: "Rank", view_to_sub: "View/Sub Ratio", view_to_sub_desc: "Views needed for 1 Sub", 
        channel_top_videos: "Recently Popular", channel_latest_videos: "Latest Episodes",
        estimated: "estimated", coming_soon: "Coming Soon", channel_ui: "Channel Rankings", back_home: "Back to Home",
        refresh_confirm: "Fetch fresh data from servers?", refresh_success: "Data refreshed!",
        tab_general: "General", tab_about: "About", app_desc: "YumeStats Pro is a data analytics tool tailored for the Anime/Manga community.", terms: "Terms of Use: Data is provided via third-party APIs.",
        tab_trending: "Timeline (New)", tab_hot: "YumeRank (Hot)", trending_desc: "Top 50 latest anime episodes", hot_desc: "Top 20 ranked by YumeRank algorithm",
        vph_desc: "Views gained per hour", er_desc: "Engagement percentage over total views", dislike_est: "Estimated dislike count",
        chart_speed: "SPEED", chart_power: "POWER", chart_base: "ATTRACTION", engagement_ratio: "Engagement Ratio", view_compare: "Top 5 Views Comparison", latest_compare: "5 Latest Episodes Comparison",
        recommended: "Recommended for you (Same Series)", total_series_views: "Total Series Views", click_to_expand: "Click to expand episodes",
        search_results: "Search Results",
        admin_panel: "Admin Panel", sync_init: "Initialize Database", sync_delta: "Sync New Episodes",
        add_video: "Add Video", delete: "Delete", input_yt_link: "Enter YouTube Link/ID...",
        maintenance: "System Under Maintenance", maintenance_desc: "The Explore tab is currently being upgraded by Admin. Please check back later!",
        genres: "Genres", add_genre: "Edit genres (Comma separated)", status_public: "Status: PUBLIC", status_private: "Status: PRIVATE (HIDDEN)",
        delete_series: "Delete Series", blacklist_ask: "Do you want to add this ID to the Blacklist so it won't auto-sync again?",
        watch_inapp: "Watch Here", watch_yt: "Watch on YouTube", close_player: "Close Player",
        clear_history: "Clear All History", clear_favorites: "Clear All Favorites",
        remove_item: "Remove from list", confirm_clear: "Confirm clear all?",
        rename_playlist: "Rename Playlist", create_playlist: "Create New Playlist", playlist_name: "Playlist Name",
        playlist_created: "Playlist Created!", playlist_exists: "Playlist already exists!",
        sync_progress: "Processing page", full_sync_note: "Fetching ALL channel videos (may take a few minutes)...",
        add_movie: "Add Movie", delete_movie: "Delete Movie", movie_admin: "Movie Management",
        movies_sync_init: "Crawl All Movies", movies_sync_done: "Movies crawled!",
        search_hint: "e.g. Attack on Titan ss3 ep5", no_results: "No matching results found",
        fuzzy_suggestion: "Did you mean:", whitelist_only: "Only official channel content",
        delete_db: "Delete Entire Database", delete_db_confirm: "⚠️ Delete ALL Explore data? This cannot be undone!",
        delete_db_done: "Database deleted!", bulk_select: "Multi-select", bulk_delete: "Delete selected",
        select_all: "Select all", deselect_all: "Deselect all", selected_count: "selected",
        page_of: "page", prev_page: "Previous", next_page: "Next",
        login_required: "Login Required", login_required_desc: "Please log in to use this feature.",
        tos_title: "YumeStats Terms of Service", tos_body: "YumeStats is an anime statistics lookup tool. Data is provided via the YouTube Data API. Do not copy or distribute content without permission. By continuing, you agree to these terms.",
        tos_agree: "Got it, continue", tos_hide_day: "Hide for 24 hours",
        new_only: "Last 30 days only", trending_7d: "Trending 30 days",
        next_episodes: "Next Episodes", assign_ep: "Assign SS/EP", assign_season: "Season (SS)", assign_episode: "Episode (EP)",
        assign_save: "Save metadata", assign_done: "Saved!", movie_page: "movie page"
    },
    ja: {
        trending: "アニメ", movies_tab: "新着ムービー", explore: "探索", search: "検索", library: "アカウント",
        all: "すべて", movies: "アニメ映画", entertainment: "エンタメ",
        views: "視聴回数", likes: "高評価", dislikes: "低評価", comments: "コメント", share: "共有", settings: "設定", language: "言語", theme: "テーマ", about: "概要",
        theme_sakura: "マンガ明", theme_cyber: "マンガ暗", theme_moe: "萌え白", theme_moe_black: "萌え黒", save: "保存", cancel: "キャンセル",
        login_prompt: "ログインしてデータを同期。", logout: "ログアウト", no_data: "空っぽ... ここには俺の嫁はいません！", loading: "データを読み込み中...", search_placeholder: "検索...", back: "戻る",
        account_title: "オタクプロフィール", my_favorites: "保存したアニメ", my_history: "履歴",
        vph: "視聴回数/時間", er: "エンゲージメント率", channel_analytics: "チャンネル分析", top_comment: "トップコメント", total_comments: "総コメント数",
        total_subs: "登録者数", total_views: "総視聴回数", total_videos: "総動画数", avg_views: "平均視聴/動画", video_vs_avg: "エピソードのパフォーマンス",
        yume_score: "Yume 指数", yume_desc: "バイラルポテンシャルスコア", desc_show: "表示", desc_hide: "隠す",
        share_yume: "YumeStatsレポートをコピー", share_yt: "元のYouTubeリンクをコピー", watch_yt: "YouTubeで見る", copied: "コピーしました！",
        seo_tags: "ハッシュタグ", copy_tags: "すべてコピー", rank: "ランク", view_to_sub: "視聴/登録者比", view_to_sub_desc: "1登録者を獲得するために必要な視聴回数", 
        channel_top_videos: "最近の人気", channel_latest_videos: "最新エピソード",
        estimated: "推定", coming_soon: "開発中", channel_ui: "チャンネルランキング", back_home: "ホームに戻る",
        refresh_confirm: "サーバーから最新データを取得しますか？", refresh_success: "データが更新されました！",
        tab_general: "一般", tab_about: "概要", app_desc: "YumeStats Pro はアニメ/マンガコミュニティ向けに設計されたデータ分析ツールです。", terms: "利用規約：データはサードパーティのAPIを介して提供されます。",
        tab_trending: "タイムライン（最新）", tab_hot: "YumeRank（トレンド）", trending_desc: "最新アニメエピソードトップ50", hot_desc: "YumeRankアルゴリズムによるトップ20",
        vph_desc: "1時間あたりの視聴回数", er_desc: "総視聴回数に対するエンゲージメント率", dislike_est: "推定低評価数",
        chart_speed: "スピード", chart_power: "パワー", chart_base: "魅力", engagement_ratio: "エンゲージメント比率", view_compare: "トップ5視聴回数比較", latest_compare: "最新5エピソード比較",
        recommended: "おすすめ（同じシリーズ）", total_series_views: "シリーズ総視聴回数", click_to_expand: "クリックして展開",
        search_results: "検索結果",
        admin_panel: "管理者パネル", sync_init: "データベースを初期化", sync_delta: "新しいエピソードを同期",
        add_video: "動画を追加", delete: "削除", input_yt_link: "YouTubeリンク/IDを入力...",
        maintenance: "システムメンテナンス中", maintenance_desc: "探索タブは現在管理者によってアップグレードされています。後で確認してください！",
        genres: "ジャンル", add_genre: "ジャンルを編集 (カンマ区切り)", status_public: "ステータス: 公開", status_private: "ステータス: メンテナンス (非表示)",
        delete_series: "シリーズを削除", blacklist_ask: "このIDをブラックリストに追加して、再同期されないようにしますか？",
        watch_inapp: "ここで見る", watch_yt: "YouTubeで見る", close_player: "プレーヤーを閉じる",
        clear_history: "履歴をすべて削除", clear_favorites: "お気に入りをすべて削除",
        remove_item: "リストから削除", confirm_clear: "すべて削除を確認しますか？",
        rename_playlist: "プレイリスト名を変更", create_playlist: "新しいプレイリストを作成", playlist_name: "プレイリスト名",
        playlist_created: "プレイリストが作成されました！", playlist_exists: "プレイリストはすでに存在します！",
        sync_progress: "ページ処理中", full_sync_note: "全チャンネル動画を取得中（数分かかる場合があります）...",
        add_movie: "映画を追加", delete_movie: "映画を削除", movie_admin: "映画管理",
        movies_sync_init: "全映画をクロール", movies_sync_done: "映画のクロール完了！",
        search_hint: "例：進撃の巨人 ss3 ep5", no_results: "一致する結果が見つかりません",
        fuzzy_suggestion: "もしかして：", whitelist_only: "公式チャンネルのみ",
        delete_db: "データベース全削除", delete_db_confirm: "⚠️ 探索データを全削除しますか？取り消せません！",
        delete_db_done: "データベースを削除しました！", bulk_select: "複数選択", bulk_delete: "選択を削除",
        select_all: "全選択", deselect_all: "選択解除", selected_count: "件選択済み",
        page_of: "ページ", prev_page: "前へ", next_page: "次へ",
        login_required: "ログインが必要です", login_required_desc: "この機能を使用するにはログインしてください。",
        tos_title: "YumeStats 利用規約", tos_body: "YumeStats はアニメ統計検索ツールです。データはYouTube Data APIで提供されます。無断でコンテンツを複製・配布しないでください。続行することで、本規約に同意したことになります。",
        tos_agree: "了解、続ける", tos_hide_day: "24時間非表示",
        new_only: "7日以内のみ", trending_7d: "7日間トレンド"
    }
};

const HARDCODED_API_KEY = 'AIzaSyDe6LoxBFSvFQpCcT7zPuRWVIHaZ1_7eAU';
const GOOGLE_CLIENT_ID = '877283188441-7i7pismohkf5lsbe350rsccp8rsdamsl.apps.googleusercontent.com';
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAwYCTI61n3TuAiz82A1uAlm-6ILnKbs6g",
    authDomain: "yumestats-28413.firebaseapp.com",
    projectId: "yumestats-28413",
    storageBucket: "yumestats-28413.firebasestorage.app",
    messagingSenderId: "451442719063",
    appId: "1:451442719063:web:8823213896bca3688c2612"
};

const ANIME_CHANNELS_WHITELIST = {
    VN: [
        { id: 'UCott96qGP5ADmsB_yNQMvDA', playlistId: 'UUott96qGP5ADmsB_yNQMvDA', name: 'Muse VN' },
        { id: 'UC7HSkveUtUDfvHoqzAk4Qmg', playlistId: 'UU7HSkveUtUDfvHoqzAk4Qmg', name: 'Ani-One Vietnam' }
    ]
};

if (FIREBASE_CONFIG.apiKey && typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG);
}

// ╔══════════════════════════════════════════════════════════════════╗
// ║  YUMESTATS CORE ENGINE LAYER v1.0                               ║
// ║  Single-source-of-truth for all tabs.                           ║
// ║  All features are queries over ONE unified dataset.             ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  Modules:                                                       ║
// ║   • metadataParser  — title parsing, enrichment, normalization  ║
// ║   • filterEngine    — all content filtering in one place        ║
// ║   • rankingEngine   — single Yume scoring algorithm             ║
// ║   • searchEngine    — fuzzy/intent-aware search                 ║
// ║   • deduplicationService — videoId-based dedup                  ║
// ║   • DataPipeline    — ingestion: fetch→filter→normalize→store   ║
// ║   • queryEngine     — unified query layer for all tabs          ║
// ╚══════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────
// filterEngine — ALL filtering goes through here
// ─────────────────────────────────────────────
const filterEngine = (() => {
    const JUNK_RE = /\b(watchalong|watch.?along|trailer|teaser|#short|shorts|preview|pv|cm|promo|ost|opening|ending|op\s*\d|ed\s*\d|amv|mad)\b/i;

    const parseDuration = (dur) => {
        if (!dur) return 0;
        const m = dur.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!m) return 0;
        return (parseInt(m[1]||0)*3600) + (parseInt(m[2]||0)*60) + parseInt(m[3]||0);
    };

    const getTitle = (v) =>
        v.snippet?.localized?.title || v.snippet?.title || v.title || '';

    return {
        // Pre-ingestion junk keyword test
        isJunk: (v) => JUNK_RE.test(getTitle(v)),

        // Minimum viable content: ≥ 120s, not junk
        isNotShort: (v) => {
            const secs = parseDuration(v.contentDetails?.duration || v.duration);
            if (secs < 120) return false;
            const title = getTitle(v).toLowerCase();
            return !JUNK_RE.test(title) && !title.includes('#short');
        },

        // Strict movie detection: keyword + duration combo
        isMovie: (v) => {
            const title = getTitle(v).toLowerCase();
            if (JUNK_RE.test(title)) return false;
            const secs = parseDuration(v.contentDetails?.duration || v.duration);
            const hasKeyword = /(movie|film|full.?movie|ova|oad|bản điện ảnh|tổng hợp|compilation|the movie|劇場版|gekijouban)/i.test(title);
            if (hasKeyword) return secs >= 25 * 60;
            // No keyword: must be ≥ 60min AND have no episode number
            const parsed = parseAnimeTitle(title);
            return secs >= 60 * 60 && !parsed.episode;
        },

        // Whitelist enforcement
        isWhitelisted: (v, whitelistIds) =>
            !whitelistIds || whitelistIds.has(v.snippet?.channelId),

        // Date range filter (pass ms cutoff timestamp)
        isWithinWindow: (v, cutoffMs) => {
            const pub = new Date(v.snippet?.publishedAt || 0).getTime();
            return pub >= cutoffMs;
        },

        // Has episode or season metadata
        hasEpisodeMeta: (v) =>
            !!(v.parsedYume?.episode || v.parsedYume?.season || v.parsedYume?.isMovie),

        // Apply a set of named criteria to an array of items
        // criteria: { whitelist?, cutoffMs?, requireEpisodeMeta?, movieOnly?, allowShorts? }
        apply: (items, criteria = {}) => {
            const { whitelist, cutoffMs, requireEpisodeMeta, movieOnly, allowShorts } = criteria;
            return items.filter(v => {
                if (!allowShorts && !filterEngine.isNotShort(v) && !v.isFromDB && !v.isFromMoviesDB) return false;
                if (whitelist && !filterEngine.isWhitelisted(v, whitelist)) return false;
                if (cutoffMs && !filterEngine.isWithinWindow(v, cutoffMs)) return false;
                if (movieOnly && !filterEngine.isMovie(v)) return false;
                if (requireEpisodeMeta && !v.isFromDB && !v.isFromMoviesDB && !filterEngine.hasEpisodeMeta(v)) return false;
                return true;
            });
        },
    };
})();

// Keep legacy aliases so existing call-sites don't break
const JUNK_KEYWORDS = /\b(watchalong|watch.?along|trailer|teaser|#short|shorts|preview|pv|cm|promo|ost|opening|ending|op\s*\d|ed\s*\d|amv|mad)\b/i;
const isMovieFormat  = (v) => filterEngine.isMovie(v);
const isNotShort     = (v) => filterEngine.isNotShort(v);

const RAM_CACHE = new Map();

const FirebaseCacheHelper = {
    set: async (key, data, ttlMinutes) => {
        if (typeof firebase === 'undefined') return;
        const now = new Date(); const expiry = now.getTime() + (ttlMinutes * 60000);
        try {
            const safeKey = encodeURIComponent(key).replace(/\./g, '%2E');
            await firebase.firestore().collection("api_cache").doc(safeKey).set({ data: data, expiry: expiry });
        } catch(e) { }
    },
    get: async (key) => {
        if (typeof firebase === 'undefined') return null;
        try {
            const safeKey = encodeURIComponent(key).replace(/\./g, '%2E');
            const doc = await firebase.firestore().collection("api_cache").doc(safeKey).get();
            if (doc.exists) {
                const item = doc.data();
                if (new Date().getTime() > item.expiry) {
                    firebase.firestore().collection("api_cache").doc(safeKey).delete().catch(()=>{}); return null;
                }
                return item.data;
            }
            return null;
        } catch(e) { return null; }
    }
};

const fetchWithCache = async (url, cacheKey, ttlMinutes = 15) => {
    const isForceRefresh = sessionStorage.getItem('ys_force_refresh') === 'true';
    if (!isForceRefresh) {
        if (RAM_CACHE.has(cacheKey)) {
            const ramItem = RAM_CACHE.get(cacheKey);
            if (new Date().getTime() < ramItem.expiry) return ramItem.data;
        }
        const fbData = await FirebaseCacheHelper.get(cacheKey);
        if (fbData) {
            RAM_CACHE.set(cacheKey, { data: fbData, expiry: new Date().getTime() + (ttlMinutes * 60000) }); return fbData;
        }
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    await FirebaseCacheHelper.set(cacheKey, data, ttlMinutes);
    RAM_CACHE.set(cacheKey, { data: data, expiry: new Date().getTime() + (ttlMinutes * 60000) });
    return data;
};

const fetchAnimeImage = async (category, cacheKey) => {
    const cached = sessionStorage.getItem(`anime_${cacheKey}`);
    if (cached) return cached;
    try {
        const res = await fetch(`https://api.waifu.pics/sfw/${category}`);
        const data = await res.json();
        sessionStorage.setItem(`anime_${cacheKey}`, data.url); return data.url;
    } catch (e) { return null; }
};

const AnimeComponent = ({ type, text, styles, subText }) => {
    const [imgUrl, setImgUrl] = useState(null);
    useEffect(() => { fetchAnimeImage(type, type + Math.floor(Math.random()*10)).then(url => setImgUrl(url)); }, [type]);

    return (
        <div className="flex flex-col items-center justify-center p-8 animate-fade-in w-full h-full min-h-[300px]">
            {imgUrl ? (
                <div className={`relative mb-6 p-2 bg-white transition-transform ${styles.isMoe ? 'rounded-full border-4 border-pink-300 shadow-[0_0_20px_rgba(255,192,203,0.6)] animate-bounce' : 'border-4 border-current rotate-2 hover:rotate-0'}`}>
                    <img src={imgUrl} className={`object-cover ${styles.isMoe ? 'w-48 h-48 md:w-64 md:h-64 rounded-full' : 'w-48 h-48 md:w-64 md:h-64 border-2 border-black'}`} alt="anime_vibe" />
                    {!styles.isMoe && <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-yellow-200/80 -rotate-2"></div>}
                </div>
            ) : <div className={`w-48 h-48 mb-6 bg-zinc-200 animate-pulse ${styles.isMoe ? 'rounded-full' : 'border-4 border-black'}`}></div>}
            
            <div className="flex flex-col items-center">
                <div className={`text-2xl md:text-3xl font-display font-black uppercase text-center px-6 py-3 ${styles.isMoe ? `${styles.card} ${styles.text}` : 'bg-white text-black border-4 border-current shadow-manga rotate-[-2deg]'}`}>
                    {text}
                </div>
                {subText && (
                    <div className={`mt-6 px-4 py-2 font-sans font-bold text-lg text-center animate-pulse ${styles.isMoe ? `text-pink-400 ${styles.card}` : 'bg-black text-white'}`}>
                        {subText}
                    </div>
                )}
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════
// YUME PARSER v2 — Robust season/episode extraction
// Handles: EN, VI, JP, romaji, multi-format titles
// ═══════════════════════════════════════════════════════
const parseAnimeTitle = (rawTitle) => {
    if (!rawTitle) return { baseTitle: 'Unknown Anime', season: null, episode: null, tags: [], isMovie: false, verified: false };

    let title = rawTitle;

    // ── Step 0: Strip channel suffixes / subtitling notes ──
    // Strip known channel brand suffixes first (Ani-One VietNam, Muse VN, etc.)
    // before the blanket pipe-strip so episode numbers in other pipe segments are preserved
    title = title
        .replace(/\s*\|\s*Ani-?One\s*Viet.*$/ig, '')   // | Ani-One VietNam ...
        .replace(/\s*\|\s*Ani-?One\b.*$/ig, '')         // | Ani-One ...
        .replace(/\s*\|\s*Muse\s*VN\b.*$/ig, '')        // | Muse VN ...
        .replace(/\s*\|\s*Muse\b.*$/ig, '')              // | Muse ...
        .replace(/\s*\|\s*POPS\b.*$/ig, '')              // | POPS ...
        .replace(/- Muse\b.*$/ig, '')
        .replace(/- POPS\b.*$/ig, '')
        .replace(/- Ani-?One\b.*$/ig, '')
        .replace(/\bVietsub\b/ig, '')
        .replace(/\b(fansub|bd|bluray|blu-ray|480p|720p|1080p|4k)\b/ig, '')
        .replace(/\s*\|\s*.*$/g, '');                   // strip any remaining pipe suffix

    // ── Step 1: Extract bracketed tags before anything else ──
    const tags = [];
    const tagRegex = /\[([^\]]+)\]|\(([^)]+)\)/g;
    let m;
    while ((m = tagRegex.exec(title)) !== null) {
        const tag = (m[1] || m[2]).trim();
        // Don't push tags that are purely resolution/quality markers
        if (!/^\d{3,4}p$/i.test(tag)) tags.push(tag);
    }
    title = title.replace(/\[[^\]]*\]|\([^)]*\)/g, ' ');

    // ── Step 2: Movie / OVA / Special detection ──
    const isMovie = /(movie|ova|oad|bản điện ảnh|tổng hợp|compilation|the movie|劇場版)/i.test(rawTitle);

    // ── Step 3: Season extraction — ordered by specificity ──
    // Must run BEFORE episode extraction to avoid false matches
    let season = null;

    const seasonPatterns = [
        /\bS(\d{1,2})\s*E\d/i,                      // S1E5 (capture S only)
        /\bSeason\s*(\d{1,2})\b/i,                   // Season 2
        /\bSS\s*(\d{1,2})\b/i,                       // SS2
        /\bS(\d{1,2})\b(?!\s*ub)/i,                  // S4, S3 — standalone (not "Sub")
        /\bPhần\s*(\d{1,2})\b/i,                     // Phần 2 (VI)
        /\bMùa\s*(\d{1,2})\b/i,                      // Mùa 2 (VI)
        /\bPart\s*(\d{1,2})\b/i,                     // Part 2
        /\b第(\d{1,2})期\b/,                           // 第2期 (JP)
        /\b(\d{1,2})(?:st|nd|rd|th)\s*Season\b/i,   // 2nd Season
        /\bCour\s*(\d)\b/i,                          // Cour 2
    ];

    for (const pat of seasonPatterns) {
        const sm = title.match(pat);
        if (sm) {
            season = sm[1];
            title = title.replace(sm[0], ' ');
            break;
        }
    }

    // ── Step 4: Episode extraction ──
    let episode = null;

    const epPatterns = [
        /\bS\d{1,2}E(\d{1,3}(?:\.\d)?)\b/i,         // S1E12
        /\bE(?:P|pisode)?\s*(\d{1,4}(?:\.\d)?)\b/i, // EP12, Episode 12, E12
        /\bTập\s*(\d{1,4}(?:\.\d)?)\b/i,             // Tập 12 (VI)
        /\bTap\s*(\d{1,4}(?:\.\d)?)\b/i,             // Tap 12 (unaccented VI)
        /\b第(\d{1,4})話\b/,                           // 第12話 (JP)
        /\bEpisode\s*(\d{1,4}(?:\.\d)?)\b/i,
        /\b#\s*(\d{1,4})\b/,                          // #12
        /\b(\d{1,3})\s*(?:Vietsub|Subbed|Dubbed)\b/i, // 12 Vietsub
        // Final fallback: standalone number at end (only if nothing else matched)
    ];

    for (const pat of epPatterns) {
        const em = title.match(pat);
        if (em) {
            episode = em[1];
            title = title.replace(em[0], ' ');
            break;
        }
    }

    // Special keywords
    if (!episode) {
        const specials = /\b(đặc biệt|ova|special|extra|bonus|final|cuối)\b/i.exec(title);
        if (specials) { episode = specials[1]; title = title.replace(specials[0], ' '); }
    }

    // ── Step 5: Clean the base title ──
    title = title
        .replace(/[:\-–—|]/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim()
        // Remove trailing connector words
        .replace(/\s+(và|and|with|feat\.?)\s*$/i, '')
        .trim();

    // If title is now empty/too short, fall back to raw
    const baseTitle = title.length >= 2 ? title : rawTitle.split(/[|\[({]/)[0].trim();

    return {
        baseTitle,
        season,
        episode,
        tags: tags.filter(Boolean),
        isMovie,
        verified: !!(season || episode || isMovie),
    };
};

// ═══════════════════════════════════════════════════════
// YUME SEARCH ENGINE v2
// Features: fuzzy matching, query intent parsing,
//           normalization (VI/EN/romaji), whitelist enforcement
// ═══════════════════════════════════════════════════════

// Levenshtein distance — O(m*n) with small strings
const levenshtein = (a, b) => {
    const m = a.length, n = b.length;
    if (m === 0) return n; if (n === 0) return m;
    const dp = Array.from({ length: m + 1 }, (_, i) => [i]);
    for (let j = 1; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
            dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1]
                : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    return dp[m][n];
};

// Normalize for comparison: lowercase, remove diacritics, collapse spaces
const normalizeStr = (str) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove diacritics
        .replace(/đ/g, 'd').replace(/Đ/g, 'd')           // Vietnamese đ
        .replace(/[^\w\s]/g, ' ')                         // remove punctuation
        .replace(/\s+/g, ' ')
        .trim();
};

// Vietnamese syllable variants (common romanizations)
const VI_SYNONYMS = {
    'kimetsu no yaiba': ['demon slayer', 'kny'],
    'shingeki no kyojin': ['attack on titan', 'aot', 'snk'],
    'boku no hero academia': ['my hero academia', 'bnha', 'mha'],
    'sword art online': ['sao'],
    'fullmetal alchemist': ['fma', 'hagane no renkinjutsushi'],
    'one piece': ['op'],
    'naruto shippuden': ['naruto shippuuden'],
    'bleach tybw': ['bleach thousand year blood war'],
    'tensura': ['tensei shitara slime', 'that time i got reincarnated as a slime', 'slime isekai'],
    'overlord': ['overlord anime'],
    'rezero': ['re zero', 're:zero', 're:zero starting life in another world'],
};

// Build reverse synonym map for O(1) lookups
const SYNONYM_MAP = {};
Object.entries(VI_SYNONYMS).forEach(([canonical, aliases]) => {
    aliases.forEach(a => { SYNONYM_MAP[normalizeStr(a)] = normalizeStr(canonical); });
    SYNONYM_MAP[normalizeStr(canonical)] = normalizeStr(canonical);
});

// Resolve query through synonym map
const resolveQuery = (q) => {
    const norm = normalizeStr(q);
    return SYNONYM_MAP[norm] || norm;
};

// Parse query intent: extract title, season, episode from free-text query
const parseQueryIntent = (rawQuery) => {
    let q = rawQuery.trim();
    let intentSeason = null, intentEpisode = null;

    // Extract episode from query: "ep5", "tập 5", "episode 5", "e5"
    const epM = q.match(/\b(?:ep|episode|tập|tap|e)\s*(\d+)\b/i);
    if (epM) { intentEpisode = epM[1]; q = q.replace(epM[0], '').trim(); }

    // Extract season from query: "ss3", "season 3", "s3", "phần 3", "mùa 3"
    const ssM = q.match(/\b(?:ss|season|s|phần|phan|mùa|mua)\s*(\d+)\b/i);
    if (ssM) { intentSeason = ssM[1]; q = q.replace(ssM[0], '').trim(); }

    // Clean remaining query
    q = q.replace(/\s+/g, ' ').trim();

    return { titleQuery: q, intentSeason, intentEpisode };
};

// Score a single item against resolved query tokens
// Returns 0-1000; higher = better match
const scoreItem = (item, resolvedTokens, resolvedFull, intentSeason, intentEpisode) => {
    const baseTitle = normalizeStr(item.parsedYume?.baseTitle || '');
    const fullTitle = normalizeStr(item.snippet?.title || item.title || '');
    const season = item.parsedYume?.season || '';
    const episode = item.parsedYume?.episode || '';

    let score = 0;

    // ── Exact title match ──
    if (baseTitle === resolvedFull || fullTitle.includes(resolvedFull)) {
        score += 500;
    } else {
        // Token coverage
        let matchedTokens = 0;
        resolvedTokens.forEach(tok => {
            if (baseTitle.includes(tok) || fullTitle.includes(tok)) matchedTokens++;
        });
        const coverage = resolvedTokens.length > 0 ? matchedTokens / resolvedTokens.length : 0;
        score += Math.round(coverage * 300);

        // Fuzzy bonus for short queries (1-2 tokens)
        if (resolvedTokens.length <= 2 && resolvedFull.length >= 4) {
            const dist = levenshtein(baseTitle.substring(0, resolvedFull.length), resolvedFull);
            const maxLen = Math.max(baseTitle.length, resolvedFull.length);
            const similarity = 1 - dist / maxLen;
            if (similarity >= 0.7) score += Math.round(similarity * 200);
        }
    }

    // ── Season filter ──
    if (intentSeason) {
        if (season === intentSeason) score += 100;
        else if (season && season !== intentSeason) score -= 400; // Wrong season = heavy penalty
    }

    // ── Episode filter ──
    if (intentEpisode) {
        if (episode === intentEpisode) score += 100;
        else if (episode && episode !== intentEpisode) score -= 200;
    }

    return score;
};

// Main search function — runs entirely against the DB index
const yumeSearch = (dbVideos, rawQuery, minScore = 100) => {
    if (!rawQuery.trim()) return [];

    const { titleQuery, intentSeason, intentEpisode } = parseQueryIntent(rawQuery);
    const resolvedFull = resolveQuery(titleQuery);
    const resolvedTokens = resolvedFull.split(/\s+/).filter(t => t.length > 1);

    if (resolvedTokens.length === 0) return [];

    return dbVideos
        .map(item => ({ item, score: scoreItem(item, resolvedTokens, resolvedFull, intentSeason, intentEpisode) }))
        .filter(({ score }) => score >= minScore)
        .sort((a, b) => b.score - a.score)
        .map(({ item }) => item);
};

// ─────────────────────────────────────────────
// searchEngine — unified search module wrapper
// ─────────────────────────────────────────────
const searchEngine = {
    normalize:    normalizeStr,
    levenshtein:  levenshtein,
    parseIntent:  parseQueryIntent,
    resolve:      resolveQuery,
    score:        scoreItem,
    // Main entry point used by all search consumers
    query: (dbVideos, rawQuery, minScore = 80) => yumeSearch(dbVideos, rawQuery, minScore),
    // Group search results into series clusters
    groupResults: (items, rawQuery) => {
        const exactMap = {};
        items.forEach(v => {
            const key = normalizeStr(v.parsedYume?.baseTitle || '');
            if (!exactMap[key]) {
                exactMap[key] = { title: v.parsedYume?.baseTitle || '', videos: [], thumbnail: v.snippet?.thumbnails?.medium?.url || '' };
            }
            exactMap[key].videos.push(v);
        });
        const groups = Object.values(exactMap).sort((a,b) => b.videos.length - a.videos.length);
        groups.forEach(g => g.videos.sort((a,b) => rankingEngine.compareEpisodes(a, b)));
        return groups;
    },
};

// ─────────────────────────────────────────────────────────────────
// Legacy wrappers — all call through rankingEngine for consistency
// ─────────────────────────────────────────────────────────────────
const calculateYumeRank = (views, likes, comments, publishedAt) =>
    rankingEngine.yumeTrend(views, likes, comments, publishedAt);

const calculateYumeScoreDetails = (videoViews, videoLikes, _u1, _u2, _u3, publishedAt) =>
    rankingEngine.yumeIndex(videoViews, videoLikes, publishedAt);

const formatExactNumber = (num) => { if (!num) return '0'; return new Intl.NumberFormat('vi-VN').format(parseInt(num, 10)); };
const MODE_TRENDING = 'trending'; const MODE_MOVIES = 'movies'; const MODE_SEARCH = 'search'; const MODE_EXPLORE = 'explore';

const CATEGORIES_MAIN = [{ id: '0', key: 'all' }, { id: '1', key: 'movies' }, { id: '24', key: 'entertainment' }];

const formatNumber = (num) => {
    if (!num) return '0'; const n = parseInt(num, 10);
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return n.toString();
};

const timeAgo = (dateString) => {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    let interval = seconds / 31536000; if (interval > 1) return Math.floor(interval) + " năm";
    interval = seconds / 2592000; if (interval > 1) return Math.floor(interval) + " tháng";
    interval = seconds / 86400; if (interval > 1) return Math.floor(interval) + " ngày";
    interval = seconds / 3600; if (interval > 1) return Math.floor(interval) + " giờ";
    interval = seconds / 60; if (interval > 1) return Math.floor(interval) + " phút";
    return "Mới đây";
};

const getVPHNum = (views, pubDate) => {
    const hrs = Math.max(1, (Date.now() - new Date(pubDate).getTime()) / 3600000);
    return Math.round(parseInt(views||0) / hrs);
};
const getVPH = (views, pubDate) => formatNumber(getVPHNum(views, pubDate));
const getER = (views, likes, comments) => {
    if (!views || parseInt(views) === 0) return '0%';
    const eng = parseInt(likes||0) + parseInt(comments||0);
    return ((eng / parseInt(views)) * 100).toFixed(2) + '%';
};

// ─────────────────────────────────────────────
// deduplicationService — videoId as primary key
// ─────────────────────────────────────────────
const deduplicationService = {
    // Dedupe an array of video items by videoId
    dedupe: (items) => {
        const seen = new Set();
        return items.filter(v => {
            const id = v.id?.videoId || v.id || v.videoId;
            if (!id || seen.has(id)) return false;
            seen.add(id);
            return true;
        });
    },

    // Merge two arrays, items from 'priority' win on conflict
    merge: (base, priority) => {
        const map = new Map();
        base.forEach(v => { const id = v.id?.videoId || v.id; if (id) map.set(id, v); });
        priority.forEach(v => { const id = v.id?.videoId || v.id; if (id) map.set(id, v); });
        return Array.from(map.values());
    },
};

// ─────────────────────────────────────────────
// rankingEngine — ONE scoring system for all tabs
// ─────────────────────────────────────────────
const rankingEngine = {
    // Parse episode number + sublabel for consistent sort
    parseEp: (ep) => {
        if (!ep) return { n: 9999, sub: '' };
        const m = String(ep).match(/^(\d+(?:\.\d+)?)([A-Za-z]?)$/);
        return m ? { n: parseFloat(m[1]), sub: (m[2]||'').toLowerCase() } : { n: 9999, sub: '' };
    },

    // Compare two videos by episode (1 → 1A → 1B → 2)
    compareEpisodes: (a, b) => {
        const ea = rankingEngine.parseEp(a.parsedYume?.episode || a.episode);
        const eb = rankingEngine.parseEp(b.parsedYume?.episode || b.episode);
        return ea.n !== eb.n ? ea.n - eb.n : ea.sub.localeCompare(eb.sub);
    },

    // Trending score (used for list sorting)
    yumeTrend: (views, likes, comments, publishedAt) => {
        const v = parseInt(views)||0, l = parseInt(likes)||0, c = parseInt(comments)||0;
        const ageHours = Math.max(1, (Date.now() - new Date(publishedAt).getTime()) / 3600000);
        const ageDays = ageHours / 24;
        const logViews = Math.log10(Math.max(1, v));
        const logVPH   = Math.log10(Math.max(1, v / ageHours));
        const er       = v > 0 ? (l + c * 3) / v : 0;
        const freshness = Math.exp(-0.05 * ageDays);
        return Math.max(0, (logVPH * 0.5 + logViews * 0.3 + er * 100 * 0.2) * freshness * 1000);
    },

    // Per-video quality score (Yume Index) — no subscriber bias
    yumeIndex: (views, likes, publishedAt) => {
        const v = parseInt(views)||0, l = parseInt(likes)||0;
        const ageHours = Math.max(1, (Date.now() - new Date(publishedAt).getTime()) / 3600000);
        const ageDays  = ageHours / 24;
        const popularityScore  = Math.min(100, (Math.log10(Math.max(1,v)) / 8) * 100);
        const engagementScore  = Math.min(100, Math.sqrt((v > 0 ? l/v : 0) / 0.10) * 100);
        const freshnessScore   = Math.min(100, 100 * Math.exp(-0.025 * ageDays));
        const velocityScore    = Math.min(100, (Math.log10(Math.max(1, v / ageHours)) / 6) * 100);
        const total = Math.round(popularityScore*0.30 + engagementScore*0.25 + velocityScore*0.25 + freshnessScore*0.20);
        let rank = 'D';
        if (total >= 78) rank = 'S'; else if (total >= 62) rank = 'A'; else if (total >= 45) rank = 'B'; else if (total >= 28) rank = 'C';
        return { score: Math.min(100, total), rank, speed: Math.round(velocityScore), power: Math.round(engagementScore), base: Math.round(popularityScore) };
    },

    // Enrich a raw YT video item with parsedYume + yumeRankScore
    enrich: (v) => {
        if (v.isFromDB || v.isFromMoviesDB || v._enriched) return v;
        const parsedYume = parseAnimeTitle(v.snippet?.localized?.title || v.snippet?.title || '');
        const yumeRankScore = rankingEngine.yumeTrend(v.statistics?.viewCount, v.statistics?.likeCount, v.statistics?.commentCount, v.snippet?.publishedAt);
        return { ...v, parsedYume, yumeRankScore, _enriched: true };
    },

    // Sort an enriched array
    sort: (items, mode) => {
        const arr = [...items];
        if (mode === 'hot') arr.sort((a,b) => (b.yumeRankScore||0) - (a.yumeRankScore||0));
        else arr.sort((a,b) => new Date(b.snippet?.publishedAt||0) - new Date(a.snippet?.publishedAt||0));
        return arr;
    },
};

// ─────────────────────────────────────────────────────────────────
// DataPipeline — Centralized ingestion: fetch → filter → normalize
// Used by: ExploreView sync, HomeView movie sync, future workers
// ─────────────────────────────────────────────────────────────────
const DataPipeline = {
    // Normalize a raw playlist item → lightweight video record
    normalizePlaylistItem: (item) => ({
        id: item.snippet?.resourceId?.videoId,
        title: item.snippet?.title,
        publishedAt: item.contentDetails?.videoPublishedAt || item.snippet?.publishedAt,
        thumbnail: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || '',
        channelId: item.snippet?.channelId || '',
    }),

    // Normalize a raw YT video API item → standard YumeStats video record
    normalizeVideoItem: (v, opts = {}) => {
        const rawTitle = v.snippet?.localized?.title || v.snippet?.title || '';
        const parsed = parseAnimeTitle(rawTitle);
        return {
            videoId: v.id,
            title: rawTitle,
            baseTitle: parsed.baseTitle,
            season: parsed.season,
            episode: parsed.episode,
            isMovie: parsed.isMovie,
            verified: parsed.verified,
            tags: parsed.tags,
            publishedAt: v.snippet?.publishedAt || '',
            thumbnail: v.snippet?.thumbnails?.high?.url || v.snippet?.thumbnails?.medium?.url || '',
            channelId: v.snippet?.channelId || '',
            channelTitle: v.snippet?.channelTitle || '',
            duration: v.contentDetails?.duration || '',
            viewCount: v.statistics?.viewCount || '0',
            likeCount: v.statistics?.likeCount || '0',
            commentCount: v.statistics?.commentCount || '0',
            region: opts.region || '',
            adminOverride: false,
        };
    },

    // Group normalized video records into series map
    groupBySeries: (videos) => {
        const map = {};
        videos.forEach(v => {
            const key = `${v.baseTitle}_${v.season||''}`;
            if (!map[key] && v.baseTitle) {
                map[key] = { baseTitle: v.baseTitle, season: v.season||'', thumbnail: v.thumbnail, lastUpdated: v.publishedAt, videos: [] };
            }
            if (map[key]) {
                map[key].videos.push({ videoId: v.videoId, title: v.title, episode: v.episode, publishedAt: v.publishedAt, thumbnail: v.thumbnail });
                if (new Date(v.publishedAt) > new Date(map[key].lastUpdated)) map[key].lastUpdated = v.publishedAt;
            }
        });
        // Sort episodes within each series
        Object.values(map).forEach(s => s.videos.sort((a,b) => rankingEngine.compareEpisodes(a,b)));
        return map;
    },

    // Pre-ingestion filter: remove junk before storing to DB
    preFilter: (videos, whitelistChannelIds) =>
        videos.filter(v => {
            const vid = v.videoId || v.id;
            if (!vid || v.title === 'Private video' || v.title === 'Deleted video') return false;
            if (filterEngine.isJunk({ snippet: { title: v.title } })) return false;
            if (whitelistChannelIds && v.channelId && !whitelistChannelIds.has(v.channelId)) return false;
            return !!(v.episode || v.season || v.isMovie);
        }),
};

// ─────────────────────────────────────────────────────────────────
// queryEngine — Unified query layer: all tabs are views of ONE dataset
// ─────────────────────────────────────────────────────────────────
// mode         : 'trending' | 'movies' | 'search' | 'explore'
// options      : { query, region, lang, apiKey, whitelist, viewMode }
// returns      : Promise<{ items, suggestion? }>
const queryEngine = {
    // Build a standard enriched item from a Firestore anime_series video record
    _dbVideoToItem: (v, seriesData) => ({
        id: { videoId: v.videoId },
        snippet: {
            title: v.title, channelId: '', channelTitle: '',
            publishedAt: v.publishedAt,
            thumbnails: { medium: { url: v.thumbnail }, high: { url: v.thumbnail } },
        },
        parsedYume: {
            baseTitle: seriesData.title, season: seriesData.season,
            episode: v.episode, isMovie: false,
        },
        yumeRankScore: 1000,
        isFromDB: true,
        _enriched: true,
    }),

    // Load all anime_series DB items for a region
    _loadDB: async (region) => {
        const snap = await firebase.firestore().collection('anime_series').get();
        const items = [];
        snap.docs.forEach(doc => {
            const d = doc.data();
            if (!d.region || d.region === region) {
                (d.videos||[]).forEach(v => items.push(queryEngine._dbVideoToItem(v, d)));
            }
        });
        return items;
    },

    // Fetch latest playlist items and stats, whitelist-enforced
    _fetchLatest: async (whitelist, whitelistIds, apiKey, lang, maxIds = 50) => {
        const promises = whitelist.map(ch =>
            fetchWithCache(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${ch.playlistId}&maxResults=50&key=${apiKey}`, `pl_${ch.playlistId}`, 30)
        );
        const results = await Promise.all(promises);
        let ids = [];
        results.forEach(d => { if (d.items) d.items.forEach(item => { const vid = item.snippet?.resourceId?.videoId; if (vid) ids.push(vid); }); });
        ids = deduplicationService.dedupe(ids.map(id => ({ id }))).map(v => v.id).slice(0, maxIds);
        if (!ids.length) return [];
        const statsData = await fetchWithCache(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${ids.join(',')}&hl=${lang}&key=${apiKey}`,
            `qs_latest_${ids[0]}_${ids.length}_${lang}`, 30
        );
        return (statsData.items||[]).filter(v => filterEngine.isWhitelisted(v, whitelistIds));
    },

    // Main query dispatcher
    run: async (mode, { query='', region='VN', lang='vi', apiKey, whitelist, whitelistIds, viewMode='latest', setMsg }) => {
        const msg = (m) => setMsg && setMsg(m);
        let items = [];
        let suggestion = null;
        const THIRTY_DAYS = Date.now() - 30*24*60*60*1000;

        // ── TRENDING ────────────────────────────────────────────────
        if (mode === MODE_TRENDING) {
            const raw = await queryEngine._fetchLatest(whitelist, whitelistIds, apiKey, lang, 50);
            items = filterEngine.apply(raw, { whitelist: whitelistIds, cutoffMs: THIRTY_DAYS });
            items = items.map(rankingEngine.enrich);
            items = filterEngine.apply(items, { requireEpisodeMeta: true, allowShorts: true });

        // ── MOVIES ──────────────────────────────────────────────────
        } else if (mode === MODE_MOVIES) {
            // Priority 1: Firestore anime_movies (admin-curated)
            try {
                const snap = await firebase.firestore().collection('anime_movies').where('region','==',region).get();
                if (!snap.empty) {
                    snap.docs.forEach(doc => {
                        const d = doc.data();
                        items.push({ id: d.videoId, snippet: { title: d.title, channelId: d.channelId, channelTitle: d.channelTitle, publishedAt: d.publishedAt, thumbnails: { medium: { url: d.thumbnail }, high: { url: d.thumbnail } } }, statistics: { viewCount: d.viewCount }, contentDetails: { duration: d.duration }, parsedYume: parseAnimeTitle(d.title), yumeRankScore: 0, isFromMoviesDB: true, _enriched: true });
                    });
                }
            } catch(e) {}
            // Fallback: live fetch if DB empty
            if (!items.length) {
                const raw = await queryEngine._fetchLatest(whitelist, whitelistIds, apiKey, lang, 100);
                items = filterEngine.apply(raw, { whitelist: whitelistIds, movieOnly: true });
                items = items.map(rankingEngine.enrich);
            }

        // ── SEARCH ──────────────────────────────────────────────────
        } else if (mode === MODE_SEARCH) {
            if (!query.trim()) return { items: [], suggestion: null };
            msg('🔍 Đang tìm kiếm...');
            // Step 1: DB-first (fast, cached)
            const dbItems = await queryEngine._loadDB(region);
            const dbResults = searchEngine.query(dbItems, query, 80);

            // Step 2: Fuzzy suggestion when no results
            if (!dbResults.length && dbItems.length) {
                const { titleQuery } = parseQueryIntent(query);
                const normQ = normalizeStr(titleQuery);
                const candidates = [...new Set(dbItems.map(v => v.parsedYume.baseTitle))];
                let best = null, bestDist = Infinity;
                candidates.forEach(c => { const d = levenshtein(normQ.slice(0,20), normalizeStr(c).slice(0,20)); if (d < bestDist && d <= 5) { bestDist = d; best = c; } });
                if (best) suggestion = best;
            }
            items = dbResults;

            // Step 3: Live fallback if DB sparse
            if (dbResults.length < 3) {
                const { titleQuery } = parseQueryIntent(query);
                const qN = normalizeStr(titleQuery);
                const liveIds = [];
                for (const ch of whitelist) {
                    let tok = '';
                    for (let i = 0; i < 3; i++) {
                        const res = await fetchWithCache(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${ch.playlistId}&maxResults=50&key=${apiKey}${tok?'&pageToken='+tok:''}`, `qs_su_${ch.playlistId}_p${i}`, 60);
                        if (!res?.items) break;
                        res.items.forEach(item => { const tN = normalizeStr(item.snippet.title); if (tN.includes(qN) || levenshtein(tN.slice(0,qN.length), qN) <= 2) { const vid = item.snippet.resourceId?.videoId; if (vid) liveIds.push(vid); } });
                        tok = res.nextPageToken || '';
                        if (!tok) break;
                    }
                }
                if (liveIds.length) {
                    const dbIdSet = new Set(dbResults.map(v => v.id?.videoId || v.id));
                    const newIds = deduplicationService.dedupe(liveIds.map(id=>({id}))).map(v=>v.id).filter(id => !dbIdSet.has(id));
                    for (let i = 0; i < newIds.length; i += 50) {
                        const chunk = newIds.slice(i,i+50).join(',');
                        const sd = await fetchWithCache(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${chunk}&hl=${lang}&key=${apiKey}`, `qs_live_${chunk}_${region}`, 120);
                        if (sd.items) {
                            const enriched = filterEngine.apply(sd.items, { whitelist: whitelistIds })
                                .map(rankingEngine.enrich);
                            items = [...items, ...enriched];
                        }
                    }
                }
            }
            // Search enforces episode metadata
            items = items.filter(v => v.isFromDB || filterEngine.hasEpisodeMeta(v));
        }

        // ── Post-process: dedup + enrich remaining + sort ──────────
        items = deduplicationService.dedupe(items);
        items = items.map(v => v._enriched ? v : rankingEngine.enrich(v));
        items = rankingEngine.sort(items, viewMode);

        return { items, suggestion };
    },
};

const Icons = {
    Menu: () => <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z"/></svg>,
    Film: () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m-4 8h4M17 8h4m-4 8h4M3 4h18v16H3z"/></svg>,
    Compass: () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
    Search: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" stroke="currentColor" strokeWidth="1"><path d="M20.87 20.17l-5.59-5.59C16.35 13.35 17 11.75 17 10c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.75 0 3.35-.65 4.58-1.71l5.59 5.59.7-.71zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>,
    ArrowLeft: () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
    Home: ({ filled }) => <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M4 21V10.08l8-6.96 8 6.96V21h-6v-6h-4v6H4z"/></svg>,
    Settings: () => <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 9.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5m0-1c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zM13.22 3l.55 2.2.13.51.5.18c.61.23 1.19.56 1.72.98l.4.32.5-.14 2.17-.62 1.22 2.11-1.63 1.59-.37.36.08.51c.05.32.08.64.08.98s-.03.66-.08.98l-.08.51.37.36 1.63 1.59-1.22 2.11-2.17-.62-.5-.14-.4.32c-.53.43-1.11.76-1.72.98l-.5.18-.13.51-.55 2.2h-2.44l-.55-2.2-.13-.51-.5-.18c-.61-.23-1.19-.56-1.72-.98l-.4-.32-.5.14-2.17.62-1.22-2.11 1.63-1.59.37-.36-.08-.51c-.05-.32-.08-.64-.08-.98s.03-.66.08-.98l.08-.51-.37-.36-1.63-1.59 1.22-2.11 2.17.62.5.14.4-.32c.53-.43 1.11-.76 1.72-.98l.5-.18.13-.51.55-2.2h2.44M14 2h-4l-.74 2.96c-.73.27-1.4.66-2 1.14l-2.92-.83-2 3.46 2.19 2.13c-.06.37-.09.75-.09 1.14s.03.77.09 1.14l-2.19 2.13 2 3.46 2.92-.83c.6.48 1.27.87 2 1.14L10 22h4l.74-2.96c.73-.27 1.4-.66 2-1.14l2.92.83 2-3.46-2.19-2.13c.06-.37.09-.75.09-1.14s-.03-.77-.09-1.14l2.19-2.13-2-3.46-2.92.83c-.6-.48-1.27-.87-2-1.14L14 2z"/></svg>,
    User: () => <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-1.94 0-3.71-.68-5.11-1.81.08-1.7 3.41-2.63 5.11-2.63s5.03.93 5.11 2.63C15.71 19.32 13.94 20 12 20zm5.83-2.69c-1.52-1.21-4.38-1.87-5.83-1.87s-4.31.66-5.83 1.87C4.81 15.65 4 13.92 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.92-.81 3.65-2.17 5.31zM12 6c-1.93 0-3.5 1.57-3.5 3.5S10.07 13 12 13s3.5-1.57 3.5-3.5S13.93 6 12 6zm0 5.5c-.83 0-1.5-.67-1.5-1.5S11.17 8.5 12 8.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>,
    Share: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M15 5.63L20.66 12 15 18.37V15v-1h-1c-3.96 0-7.14 1-9.75 3.09 1.84-4.07 5.11-6.4 9.89-7.1l.86-.13V9v-3.37M14 3v6C6.22 10.13 3.11 15.33 2 21c2.78-3.97 6.44-6 12-6v6l8-9-8-9z"/></svg>,
    Heart: ({ filled }) => <svg viewBox="0 0 24 24" width="20" height="20" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>,
    ThumbDown: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/></svg>,
    Close: () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>,
    Eye: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>,
    Chart: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>,
    Star: ({ className }) => <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="currentColor" stroke="currentColor" strokeWidth="1"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>,
    Flame: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
    Play: () => <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>,
    Refresh: () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>,
    Zap: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    ChevronDown: () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
    Pencil: () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    Trash: () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
    Plus: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    Menu: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>
};

// ── Feature 23A: Dynamic contrast detection ──
// Returns 'text-black' or 'text-white' for safe readability over any bg
const getContrastText = (bgClass) => {
    const darkBgs = ['bg-zinc-900','bg-zinc-800','bg-zinc-950','bg-black','bg-red-600','bg-red-700','bg-blue-600','bg-blue-700','bg-purple-600','bg-purple-700','bg-pink-600','bg-pink-700','bg-green-600','bg-green-700'];
    const lightBgs = ['bg-white','bg-yellow-400','bg-yellow-300','bg-pink-100','bg-pink-50','bg-zinc-100','bg-zinc-200','bg-slate-100','bg-slate-200','bg-green-100'];
    if (darkBgs.some(c => bgClass.includes(c))) return 'text-white';
    if (lightBgs.some(c => bgClass.includes(c))) return 'text-black';
    return 'text-current';
};

const getThemeStyles = (theme) => {
    if (theme === 'moe') {
        return {
            isMoe: true, bg: 'bg-white/80', text: 'text-slate-800', textMuted: 'text-slate-500',
            nav: 'bg-white/70 backdrop-blur-md border-b-2 border-pink-200',
            card: 'bg-white/90 backdrop-blur-md border-2 border-pink-200 rounded-3xl shadow-xl',
            cardHover: 'hover:bg-pink-50 hover:-translate-y-1',
            active: 'bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-2xl font-display shadow-md border-2 border-transparent',
            input: 'bg-white/50 border-2 border-pink-200 text-slate-800 rounded-2xl focus:outline-none focus:border-pink-400',
            btn: 'bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 font-display uppercase text-lg transition-all border-2 border-transparent',
            accent: 'text-pink-500', appBg: 'bg-transparent',
            chartLine: '#f472b6', chartFill: 'rgba(244, 114, 182, 0.4)',
            imgWrap: 'border-2 border-pink-200 rounded-2xl overflow-hidden shadow-sm',
            avatar: 'border-2 border-pink-300 rounded-full shadow-sm',
            badge: 'bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl shadow-md font-sans font-bold',
            explore: {
                bg: 'bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50',
                navBg: 'bg-white/80 backdrop-blur-md border-b-2 border-pink-200',
                card: 'bg-white border-2 border-pink-200 rounded-3xl shadow-lg overflow-hidden',
                cardHover: 'hover:shadow-2xl hover:scale-[1.03] hover:border-pink-400 transition-all duration-300',
                text: 'text-slate-800', textMuted: 'text-slate-500',
                accent: 'text-pink-500', accentBg: 'bg-pink-500',
                badge: 'bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full text-xs font-bold px-3 py-1',
                searchBg: 'bg-white border-2 border-pink-200 rounded-full',
                expandedBg: 'bg-gradient-to-br from-pink-50 to-purple-50',
                expandedBorder: 'border-2 border-pink-200 rounded-3xl',
                episodeCard: 'bg-white/80 border border-pink-100 rounded-2xl hover:bg-pink-50 transition-colors',
                genreActive: 'bg-pink-500 text-white border-pink-500',
                genreInactive: 'bg-transparent text-slate-500 border-slate-300 hover:border-pink-400 hover:text-pink-500',
                playerBg: 'bg-white rounded-3xl border-2 border-pink-200 shadow-2xl',
                overlayGrad: 'from-pink-900/80 via-pink-900/40 to-transparent',
                adminBg: 'bg-pink-50 border-2 border-pink-200 rounded-3xl',
            }
        };
    }
    if (theme === 'moe_black') {
        return {
            isMoe: true, bg: 'bg-zinc-900/80', text: 'text-pink-100', textMuted: 'text-pink-300',
            nav: 'bg-zinc-900/70 backdrop-blur-md border-b-2 border-pink-900',
            card: 'bg-zinc-900/90 backdrop-blur-md border-2 border-pink-900 rounded-3xl shadow-xl',
            cardHover: 'hover:bg-zinc-800 hover:-translate-y-1',
            active: 'bg-gradient-to-r from-pink-600 to-purple-800 text-white rounded-2xl font-display shadow-md border-2 border-transparent',
            input: 'bg-zinc-800/80 border-2 border-pink-900 text-pink-100 rounded-2xl focus:outline-none focus:border-pink-500',
            btn: 'bg-gradient-to-r from-pink-600 to-purple-800 text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 font-display uppercase text-lg transition-all border-2 border-transparent',
            accent: 'text-pink-500', appBg: 'bg-transparent',
            chartLine: '#ec4899', chartFill: 'rgba(236, 72, 153, 0.4)',
            imgWrap: 'border-2 border-pink-900 rounded-2xl overflow-hidden shadow-sm',
            avatar: 'border-2 border-pink-800 rounded-full shadow-sm',
            badge: 'bg-gradient-to-r from-pink-600 to-purple-800 text-white rounded-xl shadow-md font-sans font-bold',
            explore: {
                bg: 'bg-gradient-to-br from-zinc-950 via-purple-950/30 to-zinc-950',
                navBg: 'bg-zinc-900/90 backdrop-blur-md border-b border-pink-900/50',
                card: 'bg-zinc-900 border border-pink-900/50 rounded-3xl overflow-hidden',
                cardHover: 'hover:border-pink-600 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:scale-[1.02] transition-all duration-300',
                text: 'text-pink-100', textMuted: 'text-pink-400',
                accent: 'text-pink-400', accentBg: 'bg-pink-600',
                badge: 'bg-gradient-to-r from-pink-700 to-purple-900 text-pink-100 rounded-full text-xs font-bold px-3 py-1',
                searchBg: 'bg-zinc-800 border border-pink-900/50 rounded-full',
                expandedBg: 'bg-gradient-to-br from-zinc-900 to-purple-950/50',
                expandedBorder: 'border border-pink-900/50 rounded-3xl',
                episodeCard: 'bg-zinc-800/60 border border-pink-900/30 rounded-2xl hover:bg-zinc-800 transition-colors',
                genreActive: 'bg-pink-700 text-white border-pink-700',
                genreInactive: 'bg-transparent text-pink-400 border-pink-900 hover:border-pink-600 hover:text-pink-300',
                playerBg: 'bg-zinc-900 rounded-3xl border border-pink-900/50 shadow-2xl shadow-pink-900/30',
                overlayGrad: 'from-purple-950/90 via-purple-950/40 to-transparent',
                adminBg: 'bg-zinc-900 border border-pink-900/50 rounded-3xl',
            }
        };
    }
    if (theme === 'cyber') {
        return {
            isMoe: false, bg: 'bg-zinc-900', text: 'text-white', textMuted: 'text-zinc-400',
            nav: 'bg-zinc-900 border-b-4 border-white',
            card: 'bg-zinc-900 border-4 border-white shadow-manga-dark',
            cardHover: 'hover:bg-zinc-800 hover:-translate-y-1', 
            active: 'bg-white text-black border-4 border-white font-display',
            input: 'bg-zinc-900 border-4 border-white text-white focus:outline-none',
            btn: 'bg-red-500 text-white border-4 border-white shadow-manga-dark hover:-translate-y-1 hover:shadow-none font-display uppercase text-lg transition-all',
            accent: 'text-yellow-400', appBg: 'bg-zinc-800 halftone-dark',
            chartLine: '#fff', chartFill: 'rgba(255,255,255,0.2)',
            imgWrap: 'border-4 border-white', avatar: 'border-4 border-white',
            badge: 'bg-white text-black border-4 border-white font-display font-black',
            explore: {
                bg: 'bg-zinc-900 halftone-dark',
                navBg: 'bg-zinc-900 border-b-4 border-white',
                card: 'bg-zinc-900 border-4 border-white overflow-hidden',
                cardHover: 'hover:bg-zinc-800 hover:-translate-y-2 hover:shadow-[8px_8px_0px_#fff] transition-all duration-150',
                text: 'text-white', textMuted: 'text-zinc-400',
                accent: 'text-yellow-400', accentBg: 'bg-yellow-400',
                badge: 'bg-white text-black border-4 border-white font-display font-black text-xs px-2 py-0.5',
                searchBg: 'bg-zinc-900 border-4 border-white',
                expandedBg: 'bg-zinc-800',
                expandedBorder: 'border-4 border-white',
                episodeCard: 'bg-zinc-800 border-2 border-zinc-600 hover:border-white transition-colors',
                genreActive: 'bg-white text-black border-white',
                genreInactive: 'bg-transparent text-zinc-400 border-zinc-600 hover:border-white hover:text-white',
                playerBg: 'bg-zinc-900 border-4 border-white shadow-[8px_8px_0px_#fff]',
                overlayGrad: 'from-zinc-900/90 via-zinc-900/50 to-transparent',
                adminBg: 'bg-zinc-800 border-4 border-white',
            }
        };
    }
    return {
        isMoe: false, bg: 'bg-white', text: 'text-black', textMuted: 'text-zinc-600',
        nav: 'bg-white border-b-4 border-black',
        card: 'bg-white border-4 border-black shadow-manga',
        cardHover: 'hover:bg-yellow-50 hover:-translate-y-1', 
        active: 'bg-black text-white border-4 border-black font-display',
        input: 'bg-white border-4 border-black text-black focus:outline-none',
        btn: 'bg-yellow-400 text-black border-4 border-black shadow-manga hover:-translate-y-1 hover:shadow-none font-display uppercase text-lg transition-all',
        accent: 'text-red-600', appBg: 'bg-zinc-100 halftone-light',
        chartLine: '#000', chartFill: 'rgba(0,0,0,0.1)',
        imgWrap: 'border-4 border-black', avatar: 'border-4 border-black',
        badge: 'bg-black text-white border-4 border-black font-display font-black',
        explore: {
            bg: 'bg-zinc-100 halftone-light',
            navBg: 'bg-white border-b-4 border-black',
            card: 'bg-white border-4 border-black overflow-hidden shadow-manga',
            cardHover: 'hover:bg-yellow-50 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] transition-all duration-150',
            text: 'text-black', textMuted: 'text-zinc-600',
            accent: 'text-red-600', accentBg: 'bg-yellow-400',
            badge: 'bg-black text-white border-4 border-black font-display font-black text-xs px-2 py-0.5',
            searchBg: 'bg-white border-4 border-black',
            expandedBg: 'bg-yellow-50',
            expandedBorder: 'border-4 border-black',
            episodeCard: 'bg-white border-2 border-zinc-300 hover:border-black transition-colors',
            genreActive: 'bg-black text-white border-black',
            genreInactive: 'bg-transparent text-zinc-600 border-zinc-400 hover:border-black hover:text-black',
            playerBg: 'bg-white border-4 border-black shadow-manga',
            overlayGrad: 'from-black/90 via-black/50 to-transparent',
            adminBg: 'bg-yellow-50 border-4 border-black',
        }
    };
};

const MoeBackground = ({ theme }) => {
    const isDark = theme === 'moe_black';
    return (
        <div className={`fixed inset-0 z-[-1] overflow-hidden bg-gradient-to-br ${isDark ? 'from-zinc-900 via-purple-950 to-zinc-900' : 'from-pink-100 via-purple-100 to-blue-50'}`}>
            <div className={`absolute top-10 left-10 w-32 h-32 ${isDark ? 'bg-pink-900/40' : 'bg-white'} rounded-full opacity-40 blur-2xl animate-pulse`}></div>
            <div className={`absolute bottom-40 right-20 w-48 h-48 ${isDark ? 'bg-purple-900/40' : 'bg-pink-300'} rounded-full opacity-30 blur-3xl animate-pulse delay-700`}></div>
        </div>
    );
};

const MangaRadarChart = ({ data, labels, styles }) => {
    const size = 200; const cx = size/2; const cy = size/2; const r = 70;
    const getPoint = (val, angleDeg) => {
        const rad = (angleDeg * Math.PI) / 180; const len = r * (val / 100);
        return `${cx + len * Math.cos(rad)},${cy + len * Math.sin(rad)}`;
    };
    
    const points = `${getPoint(data[0], -90)} ${getPoint(data[1], 30)} ${getPoint(data[2], 150)}`;
    const maxPoints = `${getPoint(100, -90)} ${getPoint(100, 30)} ${getPoint(100, 150)}`;
    const midPoints = `${getPoint(50, -90)} ${getPoint(50, 30)} ${getPoint(50, 150)}`;

    const cSpeed = '#ef4444'; const cPower = '#f97316'; const cBase = '#3b82f6';

    return (
        <div className="flex flex-col items-center">
            <svg width="100%" height="100%" viewBox="0 0 200 200" className={styles.isMoe ? "drop-shadow-lg" : "drop-shadow-[4px_4px_0px_rgba(0,0,0,0.5)]"}>
                <polygon points={maxPoints} fill="none" stroke={styles.chartLine} strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                <polygon points={midPoints} fill="none" stroke={styles.chartLine} strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
                <polygon points={points} fill={styles.chartFill} stroke="none" />
                
                <line x1={cx} y1={cy} x2={cx} y2={cy-r} stroke={cSpeed} strokeWidth="3" strokeLinecap="round" />
                <line x1={cx} y1={cy} x2={cx + r*Math.cos(30*Math.PI/180)} y2={cy + r*Math.sin(30*Math.PI/180)} stroke={cPower} strokeWidth="3" strokeLinecap="round" />
                <line x1={cx} y1={cy} x2={cx + r*Math.cos(150*Math.PI/180)} y2={cy + r*Math.sin(150*Math.PI/180)} stroke={cBase} strokeWidth="3" strokeLinecap="round" />
                
                <circle cx={getPoint(data[0], -90).split(',')[0]} cy={getPoint(data[0], -90).split(',')[1]} r="5" fill={cSpeed} stroke="#fff" strokeWidth="2" />
                <circle cx={getPoint(data[1], 30).split(',')[0]} cy={getPoint(data[1], 30).split(',')[1]} r="5" fill={cPower} stroke="#fff" strokeWidth="2" />
                <circle cx={getPoint(data[2], 150).split(',')[0]} cy={getPoint(data[2], 150).split(',')[1]} r="5" fill={cBase} stroke="#fff" strokeWidth="2" />
            </svg>
            <div className={`flex justify-between w-full max-w-[260px] px-2 -mt-2 font-display text-sm font-black uppercase ${styles.text}`}>
                <span className="w-1/3 text-center text-blue-500">{labels[2]}<br/>{Math.round(data[2])}</span>
                <span className="w-1/3 text-center -mt-6 text-red-500">{labels[0]}<br/>{Math.round(data[0])}</span>
                <span className="w-1/3 text-center text-orange-500">{labels[1]}<br/>{Math.round(data[1])}</span>
            </div>
        </div>
    );
};

const MangaBarChart = ({ data, styles }) => {
    const maxVal = Math.max(...data.map(d => d.value), 1);
    return (
        <div className={`flex items-end gap-3 h-56 mt-4 pt-4 border-b-4 border-l-4 border-current relative`}>
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, currentColor 19px, currentColor 20px)'}}></div>
            
            {data.map((item, i) => {
                const heightPct = Math.max((item.value / maxVal) * 100, 5); 
                return (
                    <div key={i} onClick={() => window.location.hash = `#/video/${item.id}`} className="flex-1 flex flex-col justify-end group relative z-10 h-full cursor-pointer">
                        <div className={`opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 p-2 z-30 shadow-manga-sm transition-opacity duration-300 pointer-events-none whitespace-nowrap flex flex-col items-center gap-2 ${styles.isMoe ? `${styles.card} ${styles.text} rounded-2xl border-2 border-pink-200` : 'bg-white text-black border-4 border-black'}`}>
                            <img src={item.thumbnail} className={`w-32 aspect-video object-cover ${styles.imgWrap}`} />
                            <div className="font-display font-black text-sm truncate max-w-[150px]">{item.fullTitle}</div>
                            <div className="font-sans text-xs text-red-600 font-bold">{formatExactNumber(item.value)} Views</div>
                        </div>

                        <div className={`w-full bg-current transition-all duration-500 hover:bg-yellow-400 ${i===0 ? 'text-red-500' : styles.text} ${styles.isMoe ? 'rounded-t-lg shadow-sm border-2 border-transparent' : 'border-4 border-current shadow-[4px_4px_0px_rgba(0,0,0,0.5)]'}`} 
                             style={{height: `${heightPct}%`}}>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

function useHashRouter() {
    const [hash, setHash] = useState(window.location.hash || '#/');
    useEffect(() => {
        const handleHash = () => setHash(window.location.hash || '#/');
        window.addEventListener('hashchange', handleHash);
        return () => window.removeEventListener('hashchange', handleHash);
    }, []);
    return useMemo(() => {
        const parsed = { mode: MODE_TRENDING, region: 'VN', query: '', id: null, order: 'relevance' };
        const parts = hash.replace('#/', '').split('?');
        const paths = parts[0].split('/');
        
        if (paths[0] === 'account') { parsed.mode = 'account'; }
        else if (paths[0] === 'video') { parsed.mode = 'video'; parsed.id = paths[1]; }
        else if (paths[0] === 'channel') { parsed.mode = 'channel'; parsed.id = paths[1]; }
        else {
            parsed.mode = paths[0] || MODE_TRENDING;
            parsed.region = paths[1] || 'VN';
            if (parts[1]) {
                const sp = new URLSearchParams(parts[1]);
                parsed.query = sp.get('q') || '';
                parsed.order = sp.get('order') || 'relevance';
            }
        }
        return parsed;
    }, [hash]);
}

const navigateTo = (mode, region, query, order) => {
    let url = `#/${mode}/${region}`;
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (order && order !== 'relevance') params.set('order', order);
    const qStr = params.toString();
    if (qStr) url += `?${qStr}`;
    window.location.hash = url;
};

function Header({ route, t, styles, user, setShowLogin, setShowSettings, isAdmin }) {
    const [searchQuery, setSearchQuery] = useState(route.query || '');
    const [showConfirmReset, setShowConfirmReset] = useState(false);
    const [isMobileSearch, setIsMobileSearch] = useState(false);
    const [fallbackAvatar, setFallbackAvatar] = useState(null);

    const isTrending = route.mode === MODE_TRENDING || route.mode === 'account';
    const isMovies = route.mode === MODE_MOVIES;
    const isExplore = route.mode === MODE_EXPLORE;

    useEffect(() => { setSearchQuery(route.query || ''); }, [route.query]);
    
    useEffect(() => {
        if (!user && !fallbackAvatar) { fetchAnimeImage('neko', 'avatar').then(url => setFallbackAvatar(url)); }
    }, [user, fallbackAvatar]);

    const submitSearch = (e) => {
        e.preventDefault(); const sq = searchQuery.trim(); if (!sq) return;
        setIsMobileSearch(false);

        let videoId = null; let channelId = null;
        const videoRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;
        const videoMatch = sq.match(videoRegex); if (videoMatch) videoId = videoMatch[1];
        const channelRegex = /youtube\.com\/(?:c\/|channel\/|@|user\/)([^/?\s]+)/i;
        if (!videoId) {
            const channelMatch = sq.match(channelRegex); if (channelMatch) channelId = channelMatch[1];
        }

        if (videoId) window.location.hash = `#/video/${videoId}`;
        else if (channelId) {
            if (sq.includes('@')) { const handleMatch = sq.match(/@([^/?\s]+)/); if(handleMatch) channelId = '@' + handleMatch[1]; }
            window.location.hash = `#/channel/${channelId}`;
        } else { navigateTo(MODE_SEARCH, route.region || 'VN', sq, 'relevance'); }
    };

    if (isMobileSearch) {
        return (
            <div className={`flex items-center h-16 px-4 sticky top-0 z-50 animate-fade-in ${styles.nav}`}>
                <button onClick={() => setIsMobileSearch(false)} className={`p-2 mr-2 ${styles.text}`}><Icons.ArrowLeft /></button>
                <form onSubmit={submitSearch} className="flex-1 flex">
                    <div className={`flex flex-1 items-center px-4 py-1.5 transition-all ${styles.input}`}>
                        <Icons.Search />
                        <input autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('search_placeholder')} className={`w-full bg-transparent outline-none h-10 text-xl font-sans ml-3 ${styles.text}`} />
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className={`flex items-center justify-between h-16 px-4 sticky top-0 z-50 ${styles.nav}`}>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 cursor-pointer transition-transform hover:-translate-y-1" onClick={() => window.location.hash='#/'}>
                    <div className={`w-10 h-10 flex items-center justify-center bg-yellow-400 text-black ${styles.isMoe ? 'rounded-xl shadow-md' : 'border-4 border-current shadow-manga-sm'}`}><Icons.Chart /></div>
                    <span className={`font-display font-black text-2xl tracking-wider hidden sm:block ${styles.text} ${styles.isMoe ? '' : 'drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]'}`}>YUMESTATS</span>
                </div>
                <div className="hidden md:flex items-center gap-4 ml-4">
                    <div onClick={() => navigateTo(MODE_TRENDING, route.region, '', 'relevance')} className={`px-5 py-2 cursor-pointer transition-all font-display text-lg tracking-wider ${isTrending ? styles.active : `border-2 border-transparent ${styles.text} hover:-translate-y-1`}`}>{t('trending')}</div>
                    <div onClick={() => navigateTo(MODE_MOVIES, route.region, '', 'relevance')} className={`px-5 py-2 cursor-pointer transition-all font-display text-lg tracking-wider ${isMovies ? styles.active : `border-2 border-transparent ${styles.text} hover:-translate-y-1`}`}>{t('movies_tab')}</div>
                    <div onClick={() => navigateTo(MODE_EXPLORE, route.region, '', 'relevance')} className={`px-5 py-2 cursor-pointer transition-all font-display text-lg tracking-wider ${isExplore ? styles.active : `border-2 border-transparent ${styles.text} hover:-translate-y-1`}`}>{t('explore')}</div>
                </div>
            </div>

            <div className="hidden sm:flex flex-1 max-w-md mx-8">
                <form onSubmit={submitSearch} className="flex w-full">
                    <div className={`flex flex-1 items-center px-4 py-1.5 transition-all ${styles.input} ${styles.isMoe ? 'shadow-sm' : 'shadow-manga-sm'}`}>
                        <Icons.Search />
                        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('search_placeholder')} className={`w-full bg-transparent outline-none h-10 text-xl font-sans ml-3 ${styles.text}`} />
                    </div>
                </form>
            </div>

            <div className="flex items-center gap-4 relative">
                <button className={`sm:hidden p-2 border-4 border-transparent transition-transform hover:-translate-y-1 ${styles.text}`} onClick={() => setIsMobileSearch(true)}><Icons.Search /></button>
                {isAdmin && <button onClick={() => setShowConfirmReset(true)} className={`p-2 border-4 border-transparent transition-transform hover:-rotate-180 duration-500 ${styles.text}`} title="Refresh (Admin)"><Icons.Refresh /></button>}
                <button onClick={() => setShowSettings(true)} className={`p-2 border-4 border-transparent transition-transform hover:rotate-90 hover:-translate-y-1 ${styles.text}`}><Icons.Settings /></button>
                <button onClick={() => { if(user) window.location.hash='#/account'; else setShowLogin(true); }} className={`transition-transform hover:-translate-y-1 bg-white ${styles.avatar}`}>
                    {user ? <img src={user.avatar} className={`w-10 h-10 object-cover ${styles.isMoe ? 'rounded-full' : ''}`} /> : 
                     fallbackAvatar ? <img src={fallbackAvatar} className={`w-10 h-10 object-cover ${styles.isMoe ? 'rounded-full' : ''}`} /> : <div className="p-2"><Icons.User /></div>}
                </button>

                {showConfirmReset && (
                    <div className={`absolute top-14 right-0 w-64 p-4 z-50 animate-fade-in ${styles.card}`}>
                        <p className={`text-lg font-display mb-4 ${styles.text}`}>{t('refresh_confirm')}</p>
                        <div className="flex gap-2">
                            <button onClick={() => setShowConfirmReset(false)} className={`flex-1 py-2 font-display uppercase ${styles.isMoe ? 'rounded-full bg-slate-200 text-slate-800' : 'border-4 border-current'} ${styles.text}`}>Hủy</button>
                            <button onClick={() => { sessionStorage.setItem('ys_force_refresh', 'true'); RAM_CACHE.clear(); window.location.hash = '#/'; window.location.reload(); }} className={`flex-1 py-2 ${styles.btn}`}>Ok</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function MobileNav({ route, t, styles }) {
    const isTrending = route.mode === MODE_TRENDING; 
    const isMovies = route.mode === MODE_MOVIES;
    const isExplore = route.mode === MODE_EXPLORE;
    return (
        <div className={`md:hidden fixed bottom-0 left-0 right-0 h-16 flex justify-around items-center z-50 ${styles.nav} pb-safe`}>
            <div onClick={() => navigateTo(MODE_TRENDING, route.region, '', 'relevance')} className={`flex flex-col items-center justify-center flex-1 cursor-pointer transition-colors ${isTrending ? styles.accent : styles.textMuted}`}><Icons.Chart /></div>
            <div onClick={() => navigateTo(MODE_MOVIES, route.region, '', 'relevance')} className={`flex flex-col items-center justify-center flex-1 cursor-pointer transition-colors ${isMovies ? styles.accent : styles.textMuted}`}><Icons.Film /></div>
            <div onClick={() => navigateTo(MODE_EXPLORE, route.region, '', 'relevance')} className={`flex flex-col items-center justify-center flex-1 cursor-pointer transition-colors ${isExplore ? styles.accent : styles.textMuted}`}><Icons.Compass /></div>
        </div>
    );
}

function AvatarCircle({ title, url, styles }) {
    if (url) return <img src={url} loading="lazy" className={`w-10 h-10 md:w-12 md:h-12 object-cover ${styles.avatar} ${styles.text}`} />;
    const letter = title ? title.charAt(0).toUpperCase() : '?';
    return <div className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-xl font-display ${styles.avatar} ${styles.text} bg-zinc-200`}>{letter}</div>;
}

function StatBadge({ title, value, exactValue, icon, styles, accent = false, hoverTitle = null }) {
    return (
        <div title={hoverTitle} className={`relative group flex flex-col p-4 ${styles.card} transition-transform ${hoverTitle ? 'cursor-help' : ''}`}>
            <div className="flex items-center gap-3 mb-2">
                <div className={`${accent ? styles.accent : styles.text}`}>{icon}</div>
                <div className={`text-sm font-display uppercase tracking-widest ${styles.textMuted}`}>{title}</div>
            </div>
            <div className={`text-2xl lg:text-3xl font-display font-black truncate ${styles.text}`}>{value}</div>
            {exactValue && (
                <div className={`absolute bottom-full left-0 mb-2 px-3 py-1 font-sans text-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 w-max max-w-[200px] ${styles.card}`}>
                    {exactValue}
                </div>
            )}
            {!styles.isMoe && <div className="absolute top-0 right-0 w-4 h-4 border-b-4 border-l-4 border-current opacity-20"></div>}
        </div>
    );
}

/* --- TAB KHÁM PHÁ (VOD PLATFORM) --- */
function ExploreView({ t, styles, region, apiKey, isAdmin, theme }) {
    const ex = styles.explore || {};
    const ITEMS_PER_PAGE = 20;
    const [seriesList, setSeriesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [syncMsg, setSyncMsg] = useState('');
    const [expandedSeries, setExpandedSeries] = useState(null);
    const [addVideoLink, setAddVideoLink] = useState('');
    const [exploreConfig, setExploreConfig] = useState({ isPrivate: false });
    const [allGenres, setAllGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [searchQ, setSearchQ] = useState('');
    const [genreModal, setGenreModal] = useState(null);
    const [renameModal, setRenameModal] = useState(null);
    const [createModal, setCreateModal] = useState(false);
    // Feature 19E — Bulk select
    const [bulkMode, setBulkMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set());
    // Feature 19F — Pagination
    const [currentPage, setCurrentPage] = useState(1);

    const fetchDatabase = useCallback(async () => {
        setLoading(true);
        try {
            // Lấy Config Private/Public
            const configDoc = await firebase.firestore().collection('sys_metadata').doc(`explore_config`).get();
            if (configDoc.exists) setExploreConfig(configDoc.data());

            // Lấy Dữ liệu Phim
            const snapshot = await firebase.firestore().collection('anime_series').get();
            let data = snapshot.docs.map(doc => ({ docId: doc.id, genres: [], ...doc.data() }));
            data = data.filter(s => !s.region || s.region === region);
            data.sort((a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0));
            
            // Trích xuất list thể loại
            const gSet = new Set();
            data.forEach(s => { if(s.genres) s.genres.forEach(g => gSet.add(g)); });
            setAllGenres(Array.from(gSet).sort());
            
            setSeriesList(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [region]);

    useEffect(() => { if (typeof firebase !== 'undefined') fetchDatabase(); }, [fetchDatabase]);

    const activeWhitelist = ANIME_CHANNELS_WHITELIST[region] || ANIME_CHANNELS_WHITELIST.VN;

    const runInitialSync = async () => {
        if (!confirm('Hành động này sẽ quét TOÀN BỘ KÊNH và tạo Database từ đầu. Chắc chắn chứ?')) return;
        setSyncing(true); setSyncMsg(t('full_sync_note'));
        
        try {
            let allVideos = [];
            for (const ch of activeWhitelist) {
                // ── 1. Lấy TOÀN BỘ playlists của kênh (không giới hạn số trang) ──
                setSyncMsg(`📋 Đang liệt kê Playlists: ${ch.name}...`);
                let plPageToken = '';
                let channelPlaylists = [];
                do {
                    let url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${ch.id}&maxResults=50&key=${apiKey}`;
                    if (plPageToken) url += `&pageToken=${plPageToken}`;
                    const res = await fetch(url).then(r => r.json());
                    if (!res || !res.items) break;
                    channelPlaylists = [...channelPlaylists, ...res.items];
                    plPageToken = res.nextPageToken || '';
                } while (plPageToken);

                // ── 2. Lấy TẤT CẢ video từ mỗi playlist (exhaustive) ──
                for (let i = 0; i < channelPlaylists.length; i++) {
                    const pl = channelPlaylists[i];
                    setSyncMsg(`${t('sync_progress')} ${i + 1}/${channelPlaylists.length} — ${pl.snippet.title}`);
                    let itemToken = '';
                    do {
                        let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${pl.id}&maxResults=50&key=${apiKey}`;
                        if (itemToken) url += `&pageToken=${itemToken}`;
                        const res = await fetch(url).then(r => r.json());
                        if (!res || !res.items) break;
                        res.items.forEach(item => {
                            if (item.snippet.resourceId.videoId) allVideos.push(item);
                        });
                        itemToken = res.nextPageToken || '';
                    } while (itemToken);
                }

                // ── 3. Lấy TOÀN BỘ uploads (Uploads playlist = UU + channelId[2:]) ──
                setSyncMsg(`📺 Cào uploads kênh: ${ch.name}...`);
                let upPageToken = '';
                let upPage = 0;
                do {
                    upPage++;
                    setSyncMsg(`📺 Uploads ${ch.name} — trang ${upPage}`);
                    let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${ch.playlistId}&maxResults=50&key=${apiKey}`;
                    if (upPageToken) url += `&pageToken=${upPageToken}`;
                    const res = await fetch(url).then(r => r.json());
                    if (!res || !res.items) break;
                    res.items.forEach(item => {
                        if (item.snippet.resourceId.videoId) allVideos.push(item);
                    });
                    upPageToken = res.nextPageToken || '';
                } while (upPageToken);
            }

            setSyncMsg(`🔍 Đang lọc & phân loại ${allVideos.length} video...`);
            
            // Xóa trùng ID
            const uniqueMap = new Map();
            allVideos.forEach(v => uniqueMap.set(v.snippet.resourceId.videoId, v));
            let uniqueVideos = Array.from(uniqueMap.values());

            // Map & lọc — loại Shorts (duration < 60s) bằng filter tiêu đề trước, chi tiết sau
            // ── Step 4: Map to normalized records using DataPipeline ──
            const normalizedVideos = uniqueVideos.map(v => ({
                videoId: v.snippet.resourceId.videoId,
                title: v.snippet.title,
                publishedAt: v.contentDetails?.videoPublishedAt || v.snippet.publishedAt,
                thumbnail: v.snippet.thumbnails?.medium?.url || v.snippet.thumbnails?.default?.url || '',
                baseTitle: parseAnimeTitle(v.snippet.title).baseTitle,
                season: parseAnimeTitle(v.snippet.title).season || '',
                episode: parseAnimeTitle(v.snippet.title).episode,
                isMovie: parseAnimeTitle(v.snippet.title).isMovie,
                channelId: v.snippet.channelId || '',
            }));

            // ── Pre-filter via filterEngine (junk, private, no metadata) ──
            const preFiltered = DataPipeline.preFilter(normalizedVideos, null);

            // ── Duration validation batch — remove true Shorts ──
            setSyncMsg(`⏱️ Đang kiểm tra độ dài ${preFiltered.length} video...`);
            const validIds = new Set();
            for (let i = 0; i < preFiltered.length; i += 50) {
                const chunk = preFiltered.slice(i, i + 50).map(v => v.videoId).join(',');
                setSyncMsg(`⏱️ Kiểm tra duration — batch ${Math.floor(i/50)+1}/${Math.ceil(preFiltered.length/50)}`);
                try {
                    const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${chunk}&key=${apiKey}`).then(r => r.json());
                    (res.items || []).forEach(item => {
                        const dur = item.contentDetails?.duration || '';
                        const m = dur.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
                        if (m) {
                            const secs = (parseInt(m[1]||0)*3600) + (parseInt(m[2]||0)*60) + parseInt(m[3]||0);
                            if (secs >= 60) validIds.add(item.id);
                        }
                    });
                } catch(e) { preFiltered.slice(i, i+50).forEach(v => validIds.add(v.videoId)); }
            }
            const validVideos = preFiltered.filter(v => validIds.has(v.videoId));

            // ── Group by series using DataPipeline ──
            const exactMap = DataPipeline.groupBySeries(validVideos);

            // ── Write to Firestore — dedup + blacklist aware ──
            let blacklistedIds = [];
            try {
                const blSnap = await firebase.firestore().collection('sys_metadata').doc('blacklisted_series').get();
                if (blSnap.exists) blacklistedIds = blSnap.data().ids || [];
            } catch(e) {}

            const seriesKeys = Object.keys(exactMap);
            for (let i = 0; i < seriesKeys.length; i++) {
                const key = seriesKeys[i];
                if (i % 20 === 0) setSyncMsg(`💾 Lưu Database ${i}/${seriesKeys.length} series...`);
                const s = exactMap[key];
                // rankingEngine handles episode sort (1 → 1A → 1B → 2)
                s.videos.sort((a,b) => rankingEngine.compareEpisodes(a,b));
                const docId = encodeURIComponent(key).replace(/\./g, '%2E');
                if (blacklistedIds.includes(docId)) continue;
                // deduplicationService ensures no duplicate videos
                const existingDoc = await firebase.firestore().collection('anime_series').doc(docId).get();
                if (existingDoc.exists) {
                    const existingVideos = existingDoc.data().videos || [];
                    const existingIds = new Set(existingVideos.map(v => v.videoId));
                    const newVideos = s.videos.filter(v => !existingIds.has(v.videoId));
                    if (newVideos.length > 0) {
                        const merged = deduplicationService.dedupe([...existingVideos, ...newVideos].map(v => ({id: v.videoId, ...v})));
                        merged.sort((a,b) => rankingEngine.compareEpisodes(a,b));
                        await firebase.firestore().collection('anime_series').doc(docId).update({ videos: merged, lastUpdated: s.lastUpdated });
                    }
                } else {
                    await firebase.firestore().collection('anime_series').doc(docId).set({
                        title: s.baseTitle, season: s.season, thumbnail: s.thumbnail,
                        lastUpdated: s.lastUpdated, region, videos: s.videos, ignored_videos: []
                    });
                }
            }

            await firebase.firestore().collection('sys_metadata').doc(`sync_info_${region}`).set({ last_sync_time: new Date().toISOString() });
            setSyncMsg('✅ Hoàn tất!');
            setTimeout(() => { setSyncing(false); fetchDatabase(); }, 1500);

        } catch (e) {
            alert('Lỗi: ' + e.message);
            setSyncing(false);
        }
    };

    const runDeltaSync = async () => {
        setSyncing(true); setSyncMsg('Đang cập nhật tập mới...');
        try {
            const metaDoc = await firebase.firestore().collection('sys_metadata').doc(`sync_info_${region}`).get();
            const lastSync = metaDoc.exists ? new Date(metaDoc.data().last_sync_time).getTime() : 0;
            if (lastSync === 0) {
                alert("Hãy chạy 'Khởi tạo DB' lần đầu tiên trước!");
                setSyncing(false); return;
            }

            let newVideos = [];
            for (const ch of activeWhitelist) {
                let pageToken = '';
                let reachedOld = false;
                for (let i = 0; i < 3; i++) { 
                    let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${ch.playlistId}&maxResults=50&key=${apiKey}`;
                    if (pageToken) url += `&pageToken=${pageToken}`;
                    const res = await fetch(url).then(r=>r.json());
                    if (!res || !res.items) break;
                    
                    for (const item of res.items) {
                        const pubTime = new Date(item.contentDetails?.videoPublishedAt || item.snippet.publishedAt).getTime();
                        if (pubTime <= lastSync) {
                            reachedOld = true; break; 
                        }
                        if (item.snippet.resourceId.videoId) newVideos.push(item);
                    }
                    if (reachedOld) break;
                    pageToken = res.nextPageToken;
                    if (!pageToken) break;
                }
            }

            if (newVideos.length === 0) {
                setSyncMsg('Không có tập nào mới ra mắt!');
                await firebase.firestore().collection('sys_metadata').doc(`sync_info_${region}`).set({ last_sync_time: new Date().toISOString() });
                setTimeout(() => setSyncing(false), 1500);
                return;
            }

            setSyncMsg(`Tìm thấy ${newVideos.length} tập mới. Đang phân loại...`);

            // Parse & Group new videos
            const exactMap = {};
            newVideos.forEach(v => {
                const parsed = parseAnimeTitle(v.snippet.title);
                if (!parsed.episode && !parsed.season && !parsed.isMovie) return;
                
                const bTitle = parsed.baseTitle;
                const season = parsed.season || '';
                const key = `${bTitle}_${season}`;
                if (!exactMap[key] && bTitle) {
                    exactMap[key] = { baseTitle: bTitle, season: season, videos: [] };
                }
                if (bTitle) {
                    exactMap[key].videos.push({
                        videoId: v.snippet.resourceId.videoId,
                        title: v.snippet.title,
                        episode: parsed.episode,
                        publishedAt: v.contentDetails?.videoPublishedAt || v.snippet.publishedAt,
                        thumbnail: v.snippet.thumbnails?.medium?.url || v.snippet.thumbnails?.default?.url || ''
                    });
                }
            });

            // Update Firestore
            // Tải blacklist để bỏ qua các series đã bị xóa có chủ đích
            let deltaBlacklist = [];
            try {
                const blSnap = await firebase.firestore().collection('sys_metadata').doc('blacklisted_series').get();
                if (blSnap.exists) deltaBlacklist = blSnap.data().ids || [];
            } catch(e) {}

            for (const key of Object.keys(exactMap)) {
                const docId = encodeURIComponent(key).replace(/\./g, '%2E');
                // Bỏ qua nếu series đã bị blacklist
                if (deltaBlacklist.includes(docId)) continue;
                const docRef = firebase.firestore().collection('anime_series').doc(docId);
                const docSnap = await docRef.get();
                
                const s = exactMap[key];
                if (docSnap.exists) {
                    const existingData = docSnap.data();
                    let updatedVideos = [...existingData.videos];
                    let changed = false;
                    
                    s.videos.forEach(nv => {
                        // Skip: admin deleted, or admin-override episode already exists
                        if (existingData.ignored_videos?.includes(nv.videoId)) return;
                        const existing = updatedVideos.find(ev => ev.videoId === nv.videoId);
                        if (existing) {
                            // Feature 29: never overwrite adminOverride metadata
                            if (!existing.adminOverride) {
                                existing.episode = nv.episode;
                                existing.title = nv.title;
                                existing.thumbnail = nv.thumbnail;
                                changed = true;
                            }
                        } else {
                            updatedVideos.push(nv);
                            changed = true;
                        }
                    });
                    
                    if (changed) {
                        // Advanced sort: 1 → 1A → 1B → 2
                        const parseEpS = ep => { if (!ep) return { n: 9999, sub: '' }; const m = String(ep).match(/^(\d+(?:\.\d+)?)([A-Za-z]?)$/); return m ? { n: parseFloat(m[1]), sub: (m[2]||'').toLowerCase() } : { n: 9999, sub: '' }; };
                        updatedVideos.sort((a, b) => { const ea = parseEpS(a.episode), eb = parseEpS(b.episode); return ea.n !== eb.n ? ea.n - eb.n : ea.sub.localeCompare(eb.sub); });
                        await docRef.update({ videos: updatedVideos, lastUpdated: new Date().toISOString() });
                    }
                } else {
                    // Anime hoàn toàn mới
                    const parseEpN = ep => { if (!ep) return { n: 9999, sub: '' }; const m = String(ep).match(/^(\d+(?:\.\d+)?)([A-Za-z]?)$/); return m ? { n: parseFloat(m[1]), sub: (m[2]||'').toLowerCase() } : { n: 9999, sub: '' }; };
                    s.videos.sort((a, b) => { const ea = parseEpN(a.episode), eb = parseEpN(b.episode); return ea.n !== eb.n ? ea.n - eb.n : ea.sub.localeCompare(eb.sub); });
                    await docRef.set({
                        title: s.baseTitle, season: s.season,
                        thumbnail: s.videos[0]?.thumbnail || '',
                        lastUpdated: new Date().toISOString(),
                        region: region,
                        videos: s.videos, ignored_videos: []
                    });
                }
            }

            await firebase.firestore().collection('sys_metadata').doc(`sync_info_${region}`).set({ last_sync_time: new Date().toISOString() });
            setSyncMsg('Cập nhật hoàn tất!');
            setTimeout(() => { setSyncing(false); fetchDatabase(); }, 1500);

        } catch (e) {
            alert('Lỗi Delta Sync: ' + e.message);
            setSyncing(false);
        }
    };

    // TỐI ƯU 1: XÓA THÔNG MINH
    const handleRemoveEpisode = async (docId, videoId) => {
        if (!confirm('Bạn có chắc muốn xóa tập phim này khỏi Bộ?')) return;
        const wantBlacklist = confirm(t('blacklist_ask'));
        
        try {
            const docRef = firebase.firestore().collection('anime_series').doc(docId);
            const docSnap = await docRef.get();
            if (docSnap.exists) {
                const data = docSnap.data();
                const newVideos = data.videos.filter(v => v.videoId !== videoId);
                
                // NẾU SỐ VIDEO = 0 -> TỰ HỦY PLAYLIST
                if (newVideos.length === 0) {
                    await docRef.delete();
                    setSeriesList(prev => prev.filter(s => s.docId !== docId));
                    return;
                }

                const updates = { videos: newVideos };
                if (wantBlacklist) updates.ignored_videos = [...(data.ignored_videos || []), videoId];
                
                await docRef.update(updates);
                setSeriesList(prev => prev.map(s => s.docId === docId ? { ...s, ...updates } : s));
            }
        } catch (e) { alert('Lỗi xóa video: ' + e.message); }
    };

    const handleRemoveSeries = async (docId) => {
        if (!confirm('Xác nhận XÓA TOÀN BỘ playlist/series này?')) return;
        const wantBlacklist = confirm(t('blacklist_ask'));
        try {
            await firebase.firestore().collection('anime_series').doc(docId).delete();
            if (wantBlacklist) {
                const blRef = firebase.firestore().collection('sys_metadata').doc('blacklisted_series');
                const blSnap = await blRef.get();
                const existing = blSnap.exists ? (blSnap.data().ids || []) : [];
                if (!existing.includes(docId)) {
                    await blRef.set({ ids: [...existing, docId] }, { merge: true });
                }
            }
            setSeriesList(prev => prev.filter(s => s.docId !== docId));
            if (expandedSeries === docId) setExpandedSeries(null);
        } catch(e) { alert('Lỗi xóa series: ' + e.message); }
    };

    // TỐI ƯU 2: CHỈNH SỬA THỂ LOẠI VÀ TRẠNG THÁI
    const handleUpdateGenres = (docId, currentGenres) => {
        setGenreModal({ docId, currentGenres: [...currentGenres] });
    };

    const saveGenres = async (docId, newGenres) => {
        await firebase.firestore().collection('anime_series').doc(docId).update({ genres: newGenres });
        setSeriesList(prev => prev.map(s => s.docId === docId ? { ...s, genres: newGenres } : s));
        setAllGenres(prev => {
            const combined = new Set([...prev, ...newGenres]);
            return Array.from(combined).sort();
        });
        setGenreModal(null);
    };

    const handleRenameSeries = async (docId, newTitle) => {
        const trimmed = newTitle.trim();
        if (!trimmed) return;
        await firebase.firestore().collection('anime_series').doc(docId).update({ title: trimmed });
        setSeriesList(prev => prev.map(s => s.docId === docId ? { ...s, title: trimmed } : s));
        setRenameModal(null);
    };

    const handleCreatePlaylist = async (title) => {
        const trimmed = title.trim();
        if (!trimmed) return alert(t('playlist_name') + '?');
        const docId = encodeURIComponent(`${trimmed}_`).replace(/\./g, '%2E');
        const exists = seriesList.some(s => s.docId === docId);
        if (exists) return alert(t('playlist_exists'));
        const newSeries = { title: trimmed, season: '', thumbnail: '', lastUpdated: new Date().toISOString(), region, videos: [], genres: [], ignored_videos: [] };
        await firebase.firestore().collection('anime_series').doc(docId).set(newSeries);
        setSeriesList(prev => [{ docId, ...newSeries }, ...prev]);
        setCreateModal(false);
        alert(t('playlist_created'));
    };

    const togglePrivateMode = async () => {
        const newVal = !exploreConfig.isPrivate;
        await firebase.firestore().collection('sys_metadata').doc(`explore_config`).set({ isPrivate: newVal }, { merge: true });
        setExploreConfig({ isPrivate: newVal });
    };

    // Feature 19C — Delete entire database
    const handleDeleteDatabase = async () => {
        if (!confirm(t('delete_db_confirm'))) return;
        if (!confirm('Lần xác nhận cuối: Xóa TOÀN BỘ dữ liệu Explore?')) return;
        setSyncing(true); setSyncMsg('🗑️ Đang xóa database...');
        try {
            const snap = await firebase.firestore().collection('anime_series').get();
            const batches = [];
            let batch = firebase.firestore().batch();
            snap.docs.forEach((doc, i) => {
                batch.delete(doc.ref);
                if ((i + 1) % 400 === 0) { batches.push(batch); batch = firebase.firestore().batch(); }
            });
            batches.push(batch);
            for (const b of batches) await b.commit();
            setSeriesList([]);
            setSyncMsg('✅ ' + t('delete_db_done'));
            setTimeout(() => { setSyncing(false); setSyncMsg(''); }, 2000);
        } catch(e) { alert('Lỗi: ' + e.message); setSyncing(false); }
    };

    // Feature 19E — Bulk delete selected series
    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) return;
        if (!confirm(`Xóa ${selectedIds.size} series đã chọn?`)) return;
        const wantBlacklist = confirm(t('blacklist_ask'));
        setSyncing(true); setSyncMsg(`🗑️ Đang xóa ${selectedIds.size} series...`);
        try {
            let batch = firebase.firestore().batch();
            let count = 0;
            for (const docId of selectedIds) {
                batch.delete(firebase.firestore().collection('anime_series').doc(docId));
                count++;
                if (count % 400 === 0) { await batch.commit(); batch = firebase.firestore().batch(); }
            }
            await batch.commit();
            if (wantBlacklist) {
                const blRef = firebase.firestore().collection('sys_metadata').doc('blacklisted_series');
                const blSnap = await blRef.get();
                const existing = blSnap.exists ? (blSnap.data().ids || []) : [];
                const merged = [...new Set([...existing, ...Array.from(selectedIds)])];
                await blRef.set({ ids: merged }, { merge: true });
            }
            setSeriesList(prev => prev.filter(s => !selectedIds.has(s.docId)));
            setSelectedIds(new Set());
            setBulkMode(false);
        } catch(e) { alert('Lỗi: ' + e.message); }
        setSyncing(false); setSyncMsg('');
    };

    const toggleGenreFilter = (g) => {
        setSelectedGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
    };

    const handleAddVideoManually = async (docId) => {
        if (!addVideoLink) return alert('Vui lòng nhập Link hoặc ID');
        const match = addVideoLink.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([^&?\/]+)/);
        const vId = match ? match[1] : addVideoLink;
        if (!vId || vId.length !== 11) return alert('Link/ID không hợp lệ');

        try {
            const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${vId}&key=${apiKey}`);
            const data = await res.json();
            if (!data.items?.length) return alert('Không tìm thấy video này trên YouTube!');

            const video = data.items[0];
            const parsed = parseAnimeTitle(video.snippet.title);
            
            const newEp = {
                videoId: video.id,
                title: video.snippet.title,
                episode: parsed.episode,
                publishedAt: video.snippet.publishedAt,
                thumbnail: video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url || ''
            };

            const docRef = firebase.firestore().collection('anime_series').doc(docId);
            const docSnap = await docRef.get();
            if(docSnap.exists) {
                const sData = docSnap.data();
                if (sData.videos.find(v => v.videoId === vId)) return alert('Tập này đã có trong danh sách!');
                
                const newVideos = [...sData.videos, newEp].sort((a,b) => parseFloat(a.episode||999) - parseFloat(b.episode||999));
                await docRef.update({ videos: newVideos });
                
                setSeriesList(prev => prev.map(s => {
                    if (s.docId === docId) return { ...s, videos: newVideos };
                    return s;
                }));
                setAddVideoLink('');
                alert('Đã thêm thành công!');
            }
        } catch(e) { alert('Lỗi thêm video: ' + e.message); }
    };

    // TỐI ƯU 3: LỌC BẢO TRÌ (MÀN HÌNH CHẶN)
    if (!isAdmin && exploreConfig.isPrivate) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in text-center">
                <div className="text-8xl mb-6">🚧</div>
                <h1 className={`text-4xl font-display font-black uppercase mb-4 ${styles.text}`}>{t('maintenance')}</h1>
                <p className={`text-xl font-sans max-w-lg ${styles.textMuted}`}>{t('maintenance_desc')}</p>
            </div>
        );
    }

    // Lọc Series để hiển thị
    const filteredSeries = seriesList.filter(s => {
        let matchSearch = true; let matchGenre = true;
        if (searchQ.trim()) matchSearch = s.title.toLowerCase().includes(searchQ.toLowerCase());
        if (selectedGenres.length > 0) matchGenre = selectedGenres.every(g => (s.genres || []).includes(g));
        return matchSearch && matchGenre;
    });

    // Feature 19F — Pagination
    const totalPages = Math.max(1, Math.ceil(filteredSeries.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const displaySeries = filteredSeries.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

    if (loading && !syncing) return <AnimeComponent type="dance" text={t('loading')} styles={styles}/>;

    return (
        <>
        <div className={`flex-1 overflow-y-auto h-[calc(100vh-64px)] pb-20 md:pb-6 relative ${ex.bg || 'bg-zinc-950'}`}>

            {/* ── Nav Bar ── */}
            <div className={`px-6 py-4 flex flex-col md:flex-row justify-between items-center z-30 sticky top-0 gap-4 ${ex.navBg || 'bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800'} shadow-xl`}>
                <div className="flex flex-wrap items-center gap-2">
                    <span className={`font-display text-2xl mr-4 ${ex.text || 'text-white'}`}>{t('explore')}</span>
                    {allGenres.map(g => (
                        <button key={g} onClick={() => toggleGenreFilter(g)}
                            className={`px-3 py-1 text-sm font-sans font-bold transition-all border rounded-full ${selectedGenres.includes(g) ? (ex.genreActive || 'bg-white text-black border-white') : (ex.genreInactive || 'bg-transparent text-zinc-400 border-zinc-600 hover:border-white hover:text-white')}`}>
                            {g}
                        </button>
                    ))}
                </div>
                <div className={`flex items-center px-4 py-1.5 ${ex.searchBg || 'bg-zinc-900 border border-zinc-700 rounded-full'} w-full md:w-64`}>
                    <Icons.Search />
                    <input value={searchQ} onChange={(e) => setSearchQ(e.target.value)} placeholder={t('search_placeholder')}
                        className={`w-full bg-transparent outline-none h-8 text-lg font-sans ml-3 ${ex.text || 'text-white'}`} />
                </div>
            </div>

            <div className="p-4 md:p-8 max-w-[1600px] mx-auto animate-fade-in">

                {/* ── Admin Panel ── */}
                {isAdmin && (
                    <div className={`mb-8 p-6 ${ex.adminBg || 'bg-zinc-900 border border-zinc-700 rounded-2xl'}`}>
                        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                            <div className={`font-display text-2xl uppercase flex items-center gap-2 ${ex.accent || 'text-red-500'}`}>
                                <Icons.Settings/> {t('admin_panel')}
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <button onClick={() => setCreateModal(true)}
                                    className="flex items-center gap-1 px-4 py-2 font-display uppercase rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm">
                                    <Icons.Plus /> {t('create_playlist')}
                                </button>
                                <button onClick={() => { setBulkMode(m => !m); setSelectedIds(new Set()); }}
                                    className={`flex items-center gap-1 px-4 py-2 font-display uppercase rounded-lg text-sm ${bulkMode ? 'bg-orange-500 text-white' : 'bg-zinc-700 text-white hover:bg-zinc-600'}`}>
                                    <Icons.Menu /> {bulkMode ? '✕ ' + t('deselect_all') : t('bulk_select')}
                                </button>
                                <button onClick={togglePrivateMode}
                                    className={`px-4 py-2 font-sans font-bold rounded-lg text-sm ${exploreConfig.isPrivate ? 'bg-red-600/20 text-red-500 border border-red-600' : 'bg-green-600/20 text-green-500 border border-green-600'}`}>
                                    {exploreConfig.isPrivate ? t('status_private') : t('status_public')}
                                </button>
                                <button onClick={handleDeleteDatabase}
                                    className="flex items-center gap-1 px-4 py-2 font-display uppercase rounded-lg bg-red-900 text-red-300 hover:bg-red-800 text-sm border border-red-700">
                                    <Icons.Trash /> {t('delete_db')}
                                </button>
                            </div>
                        </div>

                        {/* Bulk actions bar */}
                        {bulkMode && selectedIds.size > 0 && (
                            <div className="flex items-center gap-3 mb-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                                <span className={`font-display text-orange-400 font-bold`}>{selectedIds.size} {t('selected_count')}</span>
                                <button onClick={() => setSelectedIds(new Set(filteredSeries.map(s => s.docId)))} className="text-sm text-zinc-400 hover:text-white underline">{t('select_all')}</button>
                                <button onClick={() => setSelectedIds(new Set())} className="text-sm text-zinc-400 hover:text-white underline">{t('deselect_all')}</button>
                                <button onClick={handleBulkDelete} className="ml-auto flex items-center gap-1 px-5 py-2 bg-red-600 text-white rounded-lg font-display uppercase text-sm hover:bg-red-700">
                                    <Icons.Trash /> {t('bulk_delete')}
                                </button>
                            </div>
                        )}

                        {syncing ? (
                            <div className={`text-center font-sans text-xl py-4 font-bold animate-pulse ${ex.accent || 'text-blue-400'}`}>{syncMsg}</div>
                        ) : (
                            <div className="flex flex-wrap gap-4">
                                <button onClick={runInitialSync} className="px-6 py-2 font-display uppercase rounded-lg bg-red-600 text-white hover:bg-red-700">{t('sync_init')}</button>
                                <button onClick={runDeltaSync} className="px-6 py-2 font-display uppercase rounded-lg bg-blue-600 text-white hover:bg-blue-700">{t('sync_delta')}</button>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Grid ── */}
                {displaySeries.length === 0 && !syncing && <AnimeComponent type="cry" text={t('no_data')} styles={styles} />}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {displaySeries.map((series) => {
                        const isExpanded = expandedSeries === series.docId;
                        const isSelected = selectedIds.has(series.docId);
                        return (
                            <div key={series.docId} className={`${isExpanded ? 'col-span-full' : ''} transition-all duration-300`}>

                                {/* POSTER CARD */}
                                {!isExpanded && (
                                    <div
                                        onClick={() => {
                                            if (bulkMode) {
                                                setSelectedIds(prev => {
                                                    const next = new Set(prev);
                                                    next.has(series.docId) ? next.delete(series.docId) : next.add(series.docId);
                                                    return next;
                                                });
                                            } else setExpandedSeries(series.docId);
                                        }}
                                        className={`relative aspect-[3/4] overflow-hidden cursor-pointer group shadow-lg ${ex.card || 'bg-zinc-800 rounded-xl border border-zinc-800'} ${ex.cardHover || 'hover:scale-105'} ${isSelected ? 'ring-4 ring-orange-400 ring-offset-2' : ''}`}>
                                        <img
                                            src={series.thumbnail || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><rect fill="%23333"/></svg>'}
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-t ${ex.overlayGrad || 'from-black/90 via-black/20 to-transparent'}`}></div>

                                        {/* Bulk checkbox */}
                                        {bulkMode && (
                                            <div className={`absolute top-2 left-2 w-7 h-7 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-orange-500 border-orange-500' : 'bg-black/50 border-white/50'}`}>
                                                {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                                            </div>
                                        )}

                                        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                                            {series.season && <span className="inline-block px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-sm mb-2">Season {series.season}</span>}
                                            <h3 className="font-display text-white text-base md:text-lg font-bold leading-tight line-clamp-2 drop-shadow-md">{series.title}</h3>
                                            <div className="text-zinc-400 text-xs mt-1 font-sans">{series.videos.length} Tập</div>
                                            {series.genres?.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {series.genres.slice(0,2).map(g => <span key={g} className={`text-xs ${ex.badge || 'bg-white/20 text-white rounded-full px-2 py-0.5'}`}>{g}</span>)}
                                                </div>
                                            )}
                                        </div>

                                        {isAdmin && !bulkMode && (
                                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                <button onClick={(e) => { e.stopPropagation(); setRenameModal({ docId: series.docId, currentTitle: series.title }); }} className="bg-yellow-500 p-1.5 rounded-full text-black hover:scale-110" title={t('rename_playlist')}><Icons.Pencil /></button>
                                                <button onClick={(e) => { e.stopPropagation(); handleUpdateGenres(series.docId, series.genres || []); }} className="bg-blue-600 p-1.5 rounded-full text-white hover:scale-110" title={t('genres')}><Icons.Settings /></button>
                                                <button onClick={(e) => { e.stopPropagation(); handleRemoveSeries(series.docId); }} className="bg-red-600 p-1.5 rounded-full text-white hover:scale-110" title={t('delete_series')}><Icons.Close /></button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* EXPANDED PANEL */}
                                {isExpanded && (
                                    <div className={`overflow-hidden shadow-2xl animate-fade-in flex flex-col ${ex.expandedBorder || 'bg-zinc-900 border border-zinc-700 rounded-2xl'}`}>
                                        <div className="relative h-56 md:h-80 w-full overflow-hidden">
                                            <img src={series.thumbnail || ''} className="w-full h-full object-cover opacity-40" />
                                            <div className={`absolute inset-0 bg-gradient-to-t ${ex.overlayGrad || 'from-zinc-900 to-transparent'}`}></div>
                                            <button onClick={() => setExpandedSeries(null)}
                                                className="absolute top-4 right-4 bg-white/20 hover:bg-white p-2 rounded-full text-white hover:text-black transition-colors backdrop-blur-sm">
                                                <Icons.Close />
                                            </button>
                                            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                                                <h2 className={`text-2xl md:text-4xl font-display font-black mb-2 ${ex.text || 'text-white'}`}>
                                                    {series.title} {series.season && <span className={ex.accent || 'text-red-500'}>Season {series.season}</span>}
                                                </h2>
                                                <div className={`flex items-center gap-3 text-sm font-sans font-bold ${ex.textMuted || 'text-zinc-300'} flex-wrap`}>
                                                    <span className="text-green-500">{series.videos.length} Tập</span>
                                                    {series.lastUpdated && <><span>•</span><span>{new Date(series.lastUpdated).getFullYear()}</span></>}
                                                    {series.genres?.length > 0 && (
                                                        <><span>•</span><div className="flex gap-1 flex-wrap">{series.genres.map(g => <span key={g} className={`px-2 rounded-md border ${ex.textMuted ? 'border-current' : 'border-zinc-500'}`}>{g}</span>)}</div></>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`p-6 md:p-8 ${ex.expandedBg || 'bg-zinc-900'}`}>
                                            <h3 className={`text-xl font-display mb-4 border-b pb-2 ${ex.text || 'text-white'} ${ex.textMuted ? 'border-current opacity-20' : 'border-zinc-800'}`}>Danh sách tập</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                                {series.videos.map(v => (
                                                    <div key={v.videoId}
                                                        className={`flex gap-3 p-2 rounded-xl group relative cursor-pointer ${ex.episodeCard || 'bg-zinc-800/50 hover:bg-zinc-800'} transition-colors`}
                                                        onClick={() => window.location.hash = `#/video/${v.videoId}`}>
                                                        <div className="w-28 aspect-video bg-black rounded-lg overflow-hidden shrink-0 relative">
                                                            <img src={v.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                                                            {v.episode && <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 text-xs text-white rounded font-sans font-bold">E{v.episode}</div>}
                                                        </div>
                                                        <div className="flex-1 min-w-0 py-1 flex flex-col justify-center">
                                                            <h4 className={`font-sans text-sm font-bold line-clamp-2 leading-snug ${ex.text || 'text-white'}`}>{v.title}</h4>
                                                        </div>
                                                        {isAdmin && (
                                                            <button onClick={(e) => { e.stopPropagation(); handleRemoveEpisode(series.docId, v.videoId); }}
                                                                className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:scale-110">
                                                                <Icons.Close />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {isAdmin && (
                                                <div className={`flex gap-2 mt-6 p-4 rounded-xl border border-dashed ${ex.textMuted ? 'border-current opacity-40' : 'border-zinc-600'} opacity-100`}>
                                                    <input value={addVideoLink} onChange={e => setAddVideoLink(e.target.value)}
                                                        placeholder={t('input_yt_link')}
                                                        className={`flex-1 px-4 py-2 text-lg font-sans outline-none bg-transparent ${ex.text || 'text-white'} border ${ex.textMuted ? 'border-current opacity-50' : 'border-zinc-600'} rounded-lg focus:opacity-100`} />
                                                    <button onClick={() => handleAddVideoManually(series.docId)}
                                                        className="px-6 py-2 font-display uppercase rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                                                        {t('add_video')}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Feature 19F — Pagination controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-10 pb-4">
                        <button
                            onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); setExpandedSeries(null); }}
                            disabled={safePage === 1}
                            className={`px-5 py-2 font-display uppercase text-sm rounded-lg disabled:opacity-30 ${styles.isMoe ? 'bg-pink-500 text-white disabled:bg-pink-200' : 'bg-white text-black border-2 border-black hover:bg-yellow-400 disabled:bg-zinc-200'}`}>
                            {t('prev_page')}
                        </button>
                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 2)
                                .reduce((acc, p, idx, arr) => {
                                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
                                    acc.push(p);
                                    return acc;
                                }, [])
                                .map((p, i) => p === '…' ? (
                                    <span key={`dots-${i}`} className={`px-2 py-2 ${ex.textMuted || 'text-zinc-500'}`}>…</span>
                                ) : (
                                    <button key={p} onClick={() => { setCurrentPage(p); setExpandedSeries(null); }}
                                        className={`w-10 h-10 font-display text-sm rounded-lg transition-all ${p === safePage ? (styles.isMoe ? 'bg-pink-500 text-white' : 'bg-black text-white') : (ex.episodeCard ? `${ex.episodeCard} ${ex.text || ''}` : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700')}`}>
                                        {p}
                                    </button>
                                ))
                            }
                        </div>
                        <button
                            onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); setExpandedSeries(null); }}
                            disabled={safePage === totalPages}
                            className={`px-5 py-2 font-display uppercase text-sm rounded-lg disabled:opacity-30 ${styles.isMoe ? 'bg-pink-500 text-white disabled:bg-pink-200' : 'bg-white text-black border-2 border-black hover:bg-yellow-400 disabled:bg-zinc-200'}`}>
                            {t('next_page')}
                        </button>
                        <span className={`text-sm font-sans ${ex.textMuted || 'text-zinc-500'}`}>{safePage}/{totalPages}</span>
                    </div>
                )}
            </div>
        </div>

        {/* Genre Edit Modal */}
        {genreModal && <GenreModal docId={genreModal.docId} currentGenres={genreModal.currentGenres} allKnownGenres={allGenres} t={t} onSave={saveGenres} onClose={() => setGenreModal(null)} />}

        {/* Rename Playlist Modal */}
        {renameModal && <RenameModal currentTitle={renameModal.currentTitle} docId={renameModal.docId} t={t} onSave={handleRenameSeries} onClose={() => setRenameModal(null)} />}

        {/* Create Playlist Modal */}
        {createModal && <CreatePlaylistModal t={t} onSave={handleCreatePlaylist} onClose={() => setCreateModal(false)} />}
        </>
    );
}

/* Standalone Genre Editor Modal */
function GenreModal({ docId, currentGenres, allKnownGenres, t, onSave, onClose }) {
    const [genres, setGenres] = useState([...currentGenres]);
    const [inputVal, setInputVal] = useState('');

    const addTag = (tag) => {
        const trimmed = tag.trim();
        if (trimmed && !genres.includes(trimmed)) setGenres(prev => [...prev, trimmed]);
        setInputVal('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(inputVal); }
        if (e.key === 'Backspace' && !inputVal && genres.length) setGenres(prev => prev.slice(0, -1));
    };

    const unusedSuggestions = allKnownGenres.filter(g => !genres.includes(g));

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 animate-fade-in" onClick={onClose}>
            <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-xl font-display text-white uppercase">{t('genres')}</h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white"><Icons.Close /></button>
                </div>
                <div className="flex flex-wrap gap-2 p-3 bg-zinc-800 border border-zinc-600 rounded-xl min-h-[56px] mb-4 cursor-text" onClick={() => document.getElementById('genre-input').focus()}>
                    {genres.map(g => (
                        <span key={g} className="flex items-center gap-1 px-3 py-1 bg-white/10 text-white text-sm rounded-full border border-zinc-500">
                            {g}
                            <button onClick={() => setGenres(prev => prev.filter(x => x !== g))} className="hover:text-red-400 ml-1 text-zinc-400">×</button>
                        </span>
                    ))}
                    <input
                        id="genre-input"
                        value={inputVal}
                        onChange={e => setInputVal(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={() => { if (inputVal.trim()) addTag(inputVal); }}
                        placeholder={genres.length === 0 ? t('add_genre') : ''}
                        className="bg-transparent outline-none text-white text-sm flex-1 min-w-[120px]"
                    />
                </div>
                {unusedSuggestions.length > 0 && (
                    <div className="mb-5">
                        <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wider">Thể loại đã có</p>
                        <div className="flex flex-wrap gap-2">
                            {unusedSuggestions.map(g => (
                                <button key={g} onClick={() => addTag(g)}
                                    className="px-3 py-1 text-sm rounded-full border border-zinc-600 text-zinc-300 hover:border-white hover:text-white transition-colors">
                                    + {g}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <div className="flex gap-3 justify-end mt-2">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 font-display uppercase text-sm">{t('cancel')}</button>
                    <button onClick={() => onSave(docId, genres)} className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-display uppercase text-sm">{t('save')}</button>
                </div>
            </div>
        </div>
    );
}

function RenameModal({ currentTitle, docId, t, onSave, onClose }) {
    const [title, setTitle] = useState(currentTitle);
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 animate-fade-in" onClick={onClose}>
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-xl font-display text-white uppercase">{t('rename_playlist')}</h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white"><Icons.Close /></button>
                </div>
                <input
                    autoFocus value={title} onChange={e => setTitle(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') onSave(docId, title); }}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-xl text-white font-sans text-lg outline-none focus:border-blue-500 mb-5"
                    placeholder={t('playlist_name')}
                />
                <div className="flex gap-3 justify-end">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 font-display uppercase text-sm">{t('cancel')}</button>
                    <button onClick={() => onSave(docId, title)} className="px-6 py-2 rounded-lg bg-yellow-500 text-black hover:bg-yellow-400 font-display uppercase text-sm">{t('save')}</button>
                </div>
            </div>
        </div>
    );
}

function CreatePlaylistModal({ t, onSave, onClose }) {
    const [title, setTitle] = useState('');
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 animate-fade-in" onClick={onClose}>
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-xl font-display text-white uppercase flex items-center gap-2"><Icons.Plus /> {t('create_playlist')}</h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white"><Icons.Close /></button>
                </div>
                <input
                    autoFocus value={title} onChange={e => setTitle(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') onSave(title); }}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-xl text-white font-sans text-lg outline-none focus:border-green-500 mb-5"
                    placeholder={t('playlist_name')}
                />
                <div className="flex gap-3 justify-end">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 font-display uppercase text-sm">{t('cancel')}</button>
                    <button onClick={() => onSave(title)} className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-display uppercase text-sm">{t('create_playlist')}</button>
                </div>
            </div>
        </div>
    );
}


function HomeView({ route, apiKey, t, styles, lang, region, isAdmin }) {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState('');
    const [channelDetails, setChannelDetails] = useState({});
    const [viewMode, setViewMode] = useState('latest');
    const [expandedSearch, setExpandedSearch] = useState(null);
    const [movieAddLink, setMovieAddLink] = useState('');
    const [movieSyncing, setMovieSyncing] = useState(false);
    const [movieSyncMsg, setMovieSyncMsg] = useState('');
    const [fuzzySuggestion, setFuzzySuggestion] = useState(null);
    // Feature 22A — Bulk delete for Movies
    const [movieBulkMode, setMovieBulkMode] = useState(false);
    const [selectedMovieIds, setSelectedMovieIds] = useState(new Set());
    // Feature 25 — Movies pagination
    const MOVIES_PER_PAGE = 20;
    const [moviePage, setMoviePage] = useState(1);

    const activeWhitelist = ANIME_CHANNELS_WHITELIST[region] || ANIME_CHANNELS_WHITELIST.VN;
    const whitelistChannelIds = new Set(activeWhitelist.map(ch => ch.id));
    const whitelistIds = whitelistChannelIds; // alias for queryEngine

    const fetchWithRetry = async (url, retries = 3) => {
        for (let i = 0; i < retries; i++) {
            try {
                const r = await fetch(url);
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return await r.json();
            } catch (e) {
                if (i === retries - 1) throw e;
                await new Promise(res => setTimeout(res, 1000 * (i + 1)));
            }
        }
    };

    const runMoviesSync = async () => {
        setMovieSyncing(true);
        let allIds = [];
        for (const ch of activeWhitelist) {
            setMovieSyncMsg('📺 Đang cào: ' + ch.name);
            let pageToken = '', page = 0;
            do {
                page++;
                setMovieSyncMsg('📺 ' + ch.name + ' — trang ' + page);
                let url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=' + ch.playlistId + '&maxResults=50&key=' + apiKey;
                if (pageToken) url += '&pageToken=' + pageToken;
                const res = await fetchWithCache(url, 'mv_uploads_' + ch.playlistId + '_p' + page, 120);
                if (!res || !res.items) break;
                res.items.forEach(item => { if (item.snippet?.resourceId?.videoId) allIds.push(item.snippet.resourceId.videoId); });
                pageToken = res.nextPageToken || '';
            } while (pageToken);
        }
        const unique = [...new Set(allIds)];
        const movieItems = [];
        for (let i = 0; i < unique.length; i += 50) {
            setMovieSyncMsg('📊 Kiểm tra ' + i + '/' + unique.length);
            const chunk = unique.slice(i, i + 50).join(',');
            try {
                const data = await fetchWithCache('https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=' + chunk + '&hl=' + lang + '&key=' + apiKey, 'mv_stats_' + chunk, 120);
                if (data.items) data.items.filter(v => whitelistChannelIds.has(v.snippet?.channelId) && isMovieFormat(v)).forEach(v => movieItems.push(v));
            } catch(e) {}
        }
        const writes = movieItems.map(mv => firebase.firestore().collection('anime_movies').doc(mv.id).set({
            videoId: mv.id, title: mv.snippet.localized?.title || mv.snippet.title,
            channelId: mv.snippet.channelId, channelTitle: mv.snippet.channelTitle,
            publishedAt: mv.snippet.publishedAt,
            thumbnail: mv.snippet.thumbnails.high?.url || mv.snippet.thumbnails.medium?.url || '',
            duration: mv.contentDetails?.duration || '', viewCount: mv.statistics?.viewCount || '0', region,
        }, { merge: true }));
        for (let i = 0; i < writes.length; i += 20) await Promise.all(writes.slice(i, i + 20));
        setMovieSyncMsg('✅ Xong! (' + movieItems.length + ' phim)');
        setTimeout(() => { setMovieSyncing(false); setMovieSyncMsg(''); fetchVideosData(); }, 2000);
    };

    const addMovieManually = async () => {
        if (!movieAddLink.trim()) return;
        const match = movieAddLink.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([^&?\/\s]{11})/);
        const vId = match ? match[1] : movieAddLink.trim();
        if (!vId || vId.length !== 11) return alert('Link/ID không hợp lệ');
        try {
            const data = await fetchWithCache('https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=' + vId + '&hl=' + lang + '&key=' + apiKey, 'v_manual_' + vId, 60);
            if (!data.items?.length) return alert('Không tìm thấy video!');
            const mv = data.items[0];
            if (!whitelistChannelIds.has(mv.snippet.channelId)) return alert('Video không từ kênh hợp lệ!');
            await firebase.firestore().collection('anime_movies').doc(vId).set({
                videoId: vId, title: mv.snippet.localized?.title || mv.snippet.title,
                channelId: mv.snippet.channelId, channelTitle: mv.snippet.channelTitle,
                publishedAt: mv.snippet.publishedAt,
                thumbnail: mv.snippet.thumbnails.high?.url || mv.snippet.thumbnails.medium?.url || '',
                duration: mv.contentDetails?.duration || '', viewCount: mv.statistics?.viewCount || '0', region,
            }, { merge: true });
            setMovieAddLink('');
            fetchVideosData();
            alert('Đã thêm movie!');
        } catch (e) { alert('Lỗi: ' + e.message); }
    };

    const deleteMovie = async (videoId) => {
        if (!confirm('Xóa movie này?')) return;
        await firebase.firestore().collection('anime_movies').doc(videoId).delete();
        setVideos(prev => prev.filter(v => (v.id?.videoId || v.id) !== videoId));
    };

    const handleBulkDeleteMovies = async () => {
        if (selectedMovieIds.size === 0) return;
        if (!confirm(`Xóa ${selectedMovieIds.size} movie đã chọn?`)) return;
        try {
            let batch = firebase.firestore().batch();
            let count = 0;
            for (const id of selectedMovieIds) {
                batch.delete(firebase.firestore().collection('anime_movies').doc(id));
                if (++count % 400 === 0) { await batch.commit(); batch = firebase.firestore().batch(); }
            }
            await batch.commit();
            setVideos(prev => prev.filter(v => !selectedMovieIds.has(v.id?.videoId || v.id)));
            setSelectedMovieIds(new Set());
            setMovieBulkMode(false);
        } catch(e) { alert('Lỗi: ' + e.message); }
    };

    // ── Unified query via queryEngine (Feature 32) ──────────────────
    const fetchVideosData = useCallback(async () => {
        const { mode, query } = route;
        if (mode === MODE_SEARCH && !query.trim()) { setVideos([]); setFuzzySuggestion(null); return; }
        if (mode === MODE_EXPLORE) return;

        setLoading(true); setVideos([]); setLoadingMsg(''); setFuzzySuggestion(null);
        try {
            const { items, suggestion } = await queryEngine.run(mode, {
                query, region, lang, apiKey,
                whitelist: activeWhitelist,
                whitelistIds,
                viewMode,
                setMsg: setLoadingMsg,
            });

            if (suggestion) setFuzzySuggestion(suggestion);

            // Enrich channel avatars (shared across all tabs)
            const cIds = [...new Set(items.map(v => v.snippet?.channelId).filter(Boolean))];
            const loadedChannels = {};
            const toFetch = [];
            for (const id of cIds) {
                const cached = await FirebaseCacheHelper.get('ch_info_' + id);
                if (cached) loadedChannels[id] = cached; else toFetch.push(id);
            }
            for (let i = 0; i < toFetch.length; i += 50) {
                try {
                    const r = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${toFetch.slice(i,i+50).join(',')}&key=${apiKey}`);
                    const d = await r.json();
                    if (d.items) d.items.forEach(c => {
                        loadedChannels[c.id] = { avatar: c.snippet.thumbnails.default?.url, country: c.snippet.country||'UNKNOWN' };
                        FirebaseCacheHelper.set('ch_info_'+c.id, loadedChannels[c.id], 1440);
                    });
                } catch(e) {}
            }
            setChannelDetails(prev => ({ ...prev, ...loadedChannels }));
            setVideos(items);
        } catch(err) { console.error(err); } finally { setLoading(false); setLoadingMsg(''); }
    }, [route.mode, route.query, apiKey, lang, region, viewMode]);



    useEffect(() => { fetchVideosData(); }, [fetchVideosData]);

    // All sorting goes through rankingEngine.sort (unified ranking system)
    let displayVideos = route.mode !== MODE_SEARCH
        ? rankingEngine.sort(videos, viewMode)
        : [...videos];
    // Trending caps: top-20 hot, top-50 latest (Feature 21/26)
    if (route.mode === MODE_TRENDING) {
        displayVideos = displayVideos.slice(0, viewMode === 'hot' ? 20 : 50);
    }

    const heroVideo = (route.mode === MODE_TRENDING && displayVideos.length > 0) ? displayVideos[0] : null;
    const gridVideos = (route.mode === MODE_TRENDING && displayVideos.length > 1) ? displayVideos.slice(1) : [];

    // Search grouping — all logic now in searchEngine.groupResults (Feature 33)
    const searchSeries = useMemo(() => {
        if (route.mode !== MODE_SEARCH) return [];
        const groups = searchEngine.groupResults(displayVideos, route.query || '');
        // Re-filter by intent for precision (season filter from queryIntent)
        const { intentSeason } = parseQueryIntent(route.query || '');
        if (!intentSeason) return groups;
        return groups.filter(g =>
            g.videos.some(v => !v.parsedYume?.season || v.parsedYume.season === intentSeason)
        );
    }, [displayVideos, route.mode, route.query]);

    return (
        <div className="flex-1 overflow-y-auto h-[calc(100vh-64px)] pb-20 md:pb-6 relative">
            {route.mode === MODE_SEARCH && (
                <div className={`px-6 py-4 z-30 sticky top-0 ${styles.nav}`}>
                    <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className={`font-display text-2xl ${styles.text}`}>{t('search_results')}: <span className={styles.accent}>"{route.query}"</span></span>
                        <span className={`text-sm font-sans ${styles.textMuted}`}>{t('whitelist_only')}</span>
                    </div>
                    {fuzzySuggestion && (
                        <div className={`mt-2 flex items-center gap-2 text-lg font-sans ${styles.textMuted}`}>
                            <span>{t('fuzzy_suggestion')}</span>
                            <button
                                onClick={() => { window.location.hash = `#/search/VN?q=${encodeURIComponent(fuzzySuggestion)}`; }}
                                className={`font-display font-black ${styles.accent} underline underline-offset-2 hover:opacity-80`}>
                                {fuzzySuggestion}
                            </button>
                        </div>
                    )}
                    {!loading && videos.length === 0 && !fuzzySuggestion && (
                        <p className={`mt-1 text-sm font-sans ${styles.textMuted}`}>{t('search_hint')}</p>
                    )}
                </div>
            )}

            {route.mode === MODE_MOVIES && (
                <div className={`px-6 py-4 z-30 sticky top-0 ${styles.nav}`}>
                    <div className="flex justify-between items-center flex-wrap gap-3">
                        <span className={`font-display text-2xl ${styles.text}`}>{t('movies_tab')}</span>
                        {isAdmin && (
                            <div className="flex flex-wrap gap-2 items-center">
                                <input value={movieAddLink} onChange={e => setMovieAddLink(e.target.value)}
                                    placeholder={t('input_yt_link')}
                                    className={`px-3 py-1.5 text-sm font-sans outline-none w-52 ${styles.input}`} />
                                <button onClick={addMovieManually}
                                    className={`flex items-center gap-1 px-4 py-1.5 text-sm font-display uppercase ${styles.isMoe ? 'bg-pink-500 text-white rounded-full' : 'bg-yellow-400 text-black border-2 border-black'}`}>
                                    <Icons.Plus /> {t('add_movie')}
                                </button>
                                <button onClick={() => { setMovieBulkMode(m => !m); setSelectedMovieIds(new Set()); }}
                                    className={`flex items-center gap-1 px-4 py-1.5 text-sm font-display uppercase ${movieBulkMode ? (styles.isMoe ? 'bg-orange-400 text-white rounded-full' : 'bg-orange-500 text-white border-2 border-orange-700') : (styles.isMoe ? 'bg-slate-200 text-slate-700 rounded-full' : 'border-2 border-current text-current')}`}>
                                    <Icons.Menu /> {t('bulk_select')}
                                </button>
                                <button onClick={runMoviesSync} disabled={movieSyncing}
                                    className={`flex items-center gap-1 px-4 py-1.5 text-sm font-display uppercase ${styles.isMoe ? 'bg-purple-500 text-white rounded-full' : 'bg-red-600 text-white border-2 border-black'} disabled:opacity-50`}>
                                    <Icons.Refresh /> {t('movies_sync_init')}
                                </button>
                            </div>
                        )}
                    </div>
                    {movieSyncing && (
                        <div className={`mt-2 text-sm font-sans animate-pulse ${styles.accent}`}>{movieSyncMsg}</div>
                    )}
                    {movieBulkMode && selectedMovieIds.size > 0 && (
                        <div className="flex items-center gap-3 mt-2 p-2 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                            <span className="font-display text-orange-400 font-bold text-sm">{selectedMovieIds.size} {t('selected_count')}</span>
                            <button onClick={() => setSelectedMovieIds(new Set(displayVideos.map(v => v.id?.videoId || v.id)))} className="text-xs text-zinc-400 hover:text-white underline">{t('select_all')}</button>
                            <button onClick={() => setSelectedMovieIds(new Set())} className="text-xs text-zinc-400 hover:text-white underline">{t('deselect_all')}</button>
                            <button onClick={handleBulkDeleteMovies} className="ml-auto flex items-center gap-1 px-4 py-1.5 bg-red-600 text-white rounded-lg font-display uppercase text-xs hover:bg-red-700">
                                <Icons.Trash /> {t('bulk_delete')}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {route.mode === MODE_TRENDING && (
                <div className={`sticky top-0 z-30 py-4 px-4 md:px-6 flex flex-wrap items-center gap-4 ${styles.nav}`}>
                    <span className={`font-sans text-sm font-bold ${styles.textMuted}`}>📅 {t('trending_7d')}</span>
                    <div className={`flex p-1 ${styles.isMoe ? 'bg-pink-100 rounded-full shadow-sm' : 'bg-zinc-200 border-4 border-black shadow-manga-sm'}`}>
                        <button onClick={() => setViewMode('latest')} title={t('trending_desc')} className={`px-6 py-1 text-lg font-display uppercase transition-colors border-2 border-transparent ${styles.isMoe ? 'rounded-full' : ''} ${viewMode === 'latest' ? (styles.isMoe ? 'bg-pink-400 text-white' : 'bg-black text-white border-black') : `${styles.text} hover:bg-black/10`}`}>
                            {t('tab_trending')}
                        </button>
                        <button onClick={() => setViewMode('hot')} title={t('hot_desc')} className={`px-6 py-1 text-lg font-display uppercase transition-colors flex items-center gap-1 border-2 border-transparent ${styles.isMoe ? 'rounded-full' : ''} ${viewMode === 'hot' ? (styles.isMoe ? 'bg-red-400 text-white' : 'bg-red-600 text-white border-black') : `${styles.text} hover:bg-black/10`}`}>
                            <Icons.Flame/> {t('tab_hot')}
                        </button>
                    </div>
                </div>
            )}

            <div className="p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
                {loading ? (
                    <AnimeComponent type="dance" text={t('loading')} subText={loadingMsg} styles={styles} />
                ) : (
                    <div className="flex flex-col gap-8">
                        {displayVideos.length === 0 && !loading ? (
                            <AnimeComponent type="cry" text={t('no_data')} styles={styles} />
                        ) : null}

                        {route.mode === MODE_SEARCH && searchSeries.length > 0 && (
                            <div className="flex flex-col gap-6">
                                {searchSeries.map((series, i) => {
                                    if (series.videos.length === 1) {
                                        const video = series.videos[0];
                                        return (
                                            <div key={video.id.videoId || video.id} onClick={() => window.location.hash = `#/video/${video.id.videoId || video.id}`} className={`flex flex-col md:flex-row cursor-pointer ${styles.card} ${styles.cardHover} p-0 overflow-hidden`}>
                                                <div className={`relative shrink-0 bg-black ${styles.imgWrap} w-full md:w-[280px] aspect-video border-0 rounded-none`}>
                                                    <img src={video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.high?.url} className="w-full h-full object-cover" />
                                                    <div className={`absolute bottom-2 right-2 flex flex-col items-end gap-1`}>
                                                        <div className="flex gap-1">
                                                            {video.parsedYume.season && <span className={`${styles.badge} text-xs px-2 py-0.5 bg-pink-500 text-white border-pink-700`}>SS {video.parsedYume.season}</span>}
                                                            {video.parsedYume.episode && <span className={`${styles.badge} text-xs px-2 py-0.5 bg-blue-500 text-white border-blue-700`}>EP {video.parsedYume.episode}</span>}
                                                        </div>
                                                        <span className={`${styles.badge} text-xs px-2 py-0.5`}>{video.contentDetails?.duration ? video.contentDetails.duration.replace('PT','').replace('H',':').replace('M',':').replace('S','') : ''}</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center min-w-0 p-6">
                                                    <h3 className={`font-display text-xl leading-tight line-clamp-2 mb-2 ${styles.text}`}>{video.parsedYume.baseTitle}</h3>
                                                    <p className={`font-sans text-sm ${styles.textMuted}`}>{video.snippet.channelTitle}</p>
                                                    {video.statistics && <div className={`font-display font-black text-red-500 mt-2`}>{formatNumber(video.statistics?.viewCount)} Views</div>}
                                                </div>
                                            </div>
                                        );
                                    }

                                    const isExpanded = expandedSearch === series.title;
                                    return (
                                        <div key={series.title} className={`flex flex-col overflow-hidden transition-all ${styles.card} ${!isExpanded ? styles.cardHover : ''}`}>
                                            <div onClick={() => setExpandedSearch(isExpanded ? null : series.title)} className={`flex flex-col md:flex-row cursor-pointer p-0`}>
                                                <div className={`relative shrink-0 bg-black ${styles.imgWrap} w-full md:w-[280px] aspect-video border-0 rounded-none`}>
                                                    <img src={series.thumbnail} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                        <span className={`px-4 py-2 text-lg font-display uppercase ${styles.badge}`}>{isExpanded ? 'Đóng' : t('click_to_expand')}</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center min-w-0 p-6 md:p-8">
                                                    <h3 className={`font-display text-2xl md:text-3xl line-clamp-2 leading-tight ${styles.text}`}>{series.title}</h3>
                                                    <div className="flex items-center gap-6 mt-4">
                                                        <div>
                                                            <div className={`text-sm font-display uppercase ${styles.textMuted}`}>Số tập tìm thấy</div>
                                                            <div className={`font-display text-2xl ${styles.text} font-black`}>{series.videos.length}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`p-6 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                                    <Icons.ChevronDown />
                                                </div>
                                            </div>

                                            {isExpanded && (
                                                <div className={`p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 ${styles.isMoe ? 'bg-pink-50 border-t-2 border-pink-200' : 'bg-zinc-100 border-t-4 border-black'}`}>
                                                    {series.videos.map(v => (
                                                        <div key={v.id.videoId || v.id} onClick={() => window.location.hash = `#/video/${v.id.videoId || v.id}`} className={`cursor-pointer group flex flex-col`}>
                                                            <div className={`w-full aspect-video bg-black overflow-hidden relative ${styles.imgWrap}`}>
                                                                <img src={v.snippet.thumbnails.medium?.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                                <div className={`absolute bottom-1 right-1 flex gap-1`}>
                                                                     {v.parsedYume.season && <span className={`px-2 py-0.5 text-xs bg-pink-500 text-white font-display border-2 border-pink-700`}>SS {v.parsedYume.season}</span>}
                                                                     {v.parsedYume.episode && <span className={`px-2 py-0.5 text-xs bg-blue-500 text-white font-display border-2 border-blue-700`}>EP {v.parsedYume.episode}</span>}
                                                                </div>
                                                            </div>
                                                            <div className={`font-display mt-2 line-clamp-2 text-sm ${styles.text}`}>{v.parsedYume.baseTitle}</div>
                                                            {v.statistics && <div className={`font-sans text-xs text-red-500 font-bold mt-1`}>{formatNumber(v.statistics?.viewCount)} View</div>}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {route.mode === MODE_MOVIES && displayVideos.length > 0 && (() => {
                            const totalMoviePages = Math.max(1, Math.ceil(displayVideos.length / MOVIES_PER_PAGE));
                            const safeMoviePage = Math.min(moviePage, totalMoviePages);
                            const pageMovies = displayVideos.slice((safeMoviePage - 1) * MOVIES_PER_PAGE, safeMoviePage * MOVIES_PER_PAGE);
                            return (
                            <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {pageMovies.map((video) => {
                                    const vid = video.id.videoId || video.id;
                                    const parsed = video.parsedYume || parseAnimeTitle(video.snippet?.title || '');
                                    const isMovieSel = selectedMovieIds.has(vid);
                                    return (
                                    <div key={vid}
                                        onClick={() => {
                                            if (movieBulkMode) {
                                                setSelectedMovieIds(prev => { const n = new Set(prev); n.has(vid) ? n.delete(vid) : n.add(vid); return n; });
                                            } else window.location.hash = `#/video/${vid}`;
                                        }}
                                        className={`relative flex flex-col cursor-pointer ${styles.card} ${styles.cardHover} overflow-hidden p-0 group ${isMovieSel ? 'ring-4 ring-orange-400 ring-offset-2' : ''}`}>
                                        {movieBulkMode && (
                                            <div className={`absolute top-2 left-2 z-20 w-7 h-7 rounded-full border-2 flex items-center justify-center ${isMovieSel ? 'bg-orange-500 border-orange-500' : 'bg-black/50 border-white/50'}`}>
                                                {isMovieSel && <span className="text-white text-xs font-bold">✓</span>}
                                            </div>
                                        )}
                                        {isAdmin && !movieBulkMode && (
                                            <button onClick={(e) => { e.stopPropagation(); deleteMovie(vid); }}
                                                className="absolute top-2 right-2 z-20 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:scale-110">
                                                <Icons.Trash />
                                            </button>
                                        )}
                                        <div className="flex flex-col flex-1">
                                            <div className={`relative bg-black aspect-video overflow-hidden`}>
                                                <img src={video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute top-3 left-3 flex gap-1">
                                                    {parsed.baseTitle.toLowerCase().includes('tổng hợp') ?
                                                        <span className={`${styles.badge} text-sm px-3 py-1 bg-yellow-500 text-black border-yellow-700 uppercase`}>Tổng Hợp</span> :
                                                        <span className={`${styles.badge} text-sm px-3 py-1 bg-purple-500 text-white border-purple-700 uppercase`}>Movie</span>
                                                    }
                                                </div>
                                                <div className="absolute bottom-3 right-3">
                                                    <span className={`${styles.badge} text-sm px-3 py-1`}>{video.contentDetails?.duration ? video.contentDetails.duration.replace('PT','').replace('H','h').replace('M','m').replace('S','s') : ''}</span>
                                                </div>
                                            </div>
                                            <div className="p-6 flex-1 flex flex-col justify-between">
                                                <h3 className={`font-display text-2xl leading-tight line-clamp-2 mb-3 ${styles.text}`}>{parsed.baseTitle}</h3>
                                                <div className="flex justify-between items-center mt-2 pt-4 border-t-2 border-current opacity-70">
                                                    <span className={`font-sans text-sm font-bold truncate ${styles.text}`}>{video.snippet.channelTitle}</span>
                                                    <span className={`font-display text-sm font-black text-red-500`}>{formatNumber(video.statistics?.viewCount)} Views</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                            {/* Feature 25 — Movies pagination */}
                            {totalMoviePages > 1 && (
                                <div className="flex items-center justify-center gap-3 mt-8">
                                    <button onClick={() => setMoviePage(p => Math.max(1, p - 1))} disabled={safeMoviePage === 1}
                                        className={`px-5 py-2 font-display uppercase text-sm disabled:opacity-30 ${styles.isMoe ? 'bg-pink-500 text-white rounded-full disabled:bg-pink-200' : 'bg-white text-black border-2 border-black hover:bg-yellow-400 disabled:bg-zinc-200'}`}>
                                        {t('prev_page')}
                                    </button>
                                    {Array.from({ length: totalMoviePages }, (_, i) => i + 1)
                                        .filter(p => p === 1 || p === totalMoviePages || Math.abs(p - safeMoviePage) <= 2)
                                        .reduce((acc, p, idx, arr) => { if (idx > 0 && p - arr[idx-1] > 1) acc.push('…'); acc.push(p); return acc; }, [])
                                        .map((p, i) => p === '…' ? (
                                            <span key={`md${i}`} className={`px-2 ${styles.textMuted}`}>…</span>
                                        ) : (
                                            <button key={p} onClick={() => setMoviePage(p)}
                                                className={`w-10 h-10 font-display text-sm rounded-lg ${p === safeMoviePage ? (styles.isMoe ? 'bg-pink-500 text-white' : 'bg-black text-white') : (styles.isMoe ? 'bg-pink-100 text-pink-700 hover:bg-pink-200' : 'bg-zinc-200 text-black hover:bg-zinc-300')}`}>
                                                {p}
                                            </button>
                                        ))
                                    }
                                    <button onClick={() => setMoviePage(p => Math.min(totalMoviePages, p + 1))} disabled={safeMoviePage === totalMoviePages}
                                        className={`px-5 py-2 font-display uppercase text-sm disabled:opacity-30 ${styles.isMoe ? 'bg-pink-500 text-white rounded-full disabled:bg-pink-200' : 'bg-white text-black border-2 border-black hover:bg-yellow-400 disabled:bg-zinc-200'}`}>
                                        {t('next_page')}
                                    </button>
                                    <span className={`text-sm font-sans ${styles.textMuted}`}>{safeMoviePage}/{totalMoviePages}</span>
                                </div>
                            )}
                            </>
                            );
                        })()}

                        {route.mode === MODE_TRENDING && heroVideo && (
                            <div onClick={() => window.location.hash = `#/video/${heroVideo.id.videoId || heroVideo.id}`} className={`relative flex flex-col md:flex-row cursor-pointer ${styles.card} ${styles.cardHover}`}>
                                <div className={`absolute -top-4 -left-4 z-20 ${styles.badge} text-2xl md:text-3xl px-4 py-2 rotate-[-10deg]`}>
                                    #1 {viewMode === 'hot' ? 'HOT' : 'NEW'}
                                </div>
                                <div className={`relative w-full md:w-2/3 bg-black overflow-hidden group ${styles.isMoe ? 'rounded-l-3xl' : 'border-r-4 border-current'}`}>
                                    <img src={heroVideo.snippet.thumbnails.maxres?.url || heroVideo.snippet.thumbnails.high?.url} className="w-full h-full object-cover aspect-video group-hover:scale-105 transition-transform duration-500" />
                                    
                                    <div className={`absolute bottom-4 right-4 flex flex-col items-end gap-1`}>
                                        <div className="flex gap-1">
                                            {heroVideo.parsedYume.season && <span className={`${styles.badge} text-sm px-3 py-1 bg-pink-500 text-white border-pink-700 rotate-3`}>SS {heroVideo.parsedYume.season}</span>}
                                            {heroVideo.parsedYume.episode && <span className={`${styles.badge} text-sm px-3 py-1 bg-blue-500 text-white border-blue-700 rotate-3`}>EP {heroVideo.parsedYume.episode}</span>}
                                        </div>
                                        <span className={`${styles.badge} px-3 py-1 text-sm rotate-3`}>{heroVideo.contentDetails?.duration ? heroVideo.contentDetails.duration.replace('PT','').replace('H',':').replace('M',':').replace('S','') : ''}</span>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 p-6 flex flex-col justify-center relative">
                                    <h3 className={`font-display text-3xl md:text-4xl font-black leading-snug line-clamp-3 mb-2 ${styles.text}`}>
                                        {heroVideo.parsedYume.baseTitle}
                                    </h3>
                                    <div className="flex items-center gap-3 mb-6">
                                        <AvatarCircle title={heroVideo.snippet.channelTitle} url={channelDetails[heroVideo.snippet.channelId]?.avatar} styles={styles} />
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xl font-sans font-bold truncate ${styles.text}`}>{heroVideo.snippet.channelTitle}</p>
                                            <p className={`text-sm font-sans ${styles.textMuted}`}>{timeAgo(heroVideo.snippet.publishedAt)}</p>
                                        </div>
                                    </div>
                                    <div className={`flex justify-between items-end pt-4 ${styles.isMoe ? 'border-t-2 border-pink-200' : 'border-t-4 border-current'}`}>
                                        <div>
                                            <div className={`text-sm font-display uppercase ${styles.textMuted}`}>{t('views')}</div>
                                            <div className={`font-display text-3xl font-black ${styles.text}`}>{formatNumber(heroVideo.statistics?.viewCount)}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-sm font-display uppercase text-red-500 flex items-center gap-1`}><Icons.Flame/> YumeRank</div>
                                            <div className={`font-display text-3xl font-black text-red-500`}>{Math.round(heroVideo.yumeRankScore)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {route.mode === MODE_TRENDING && gridVideos.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {gridVideos.map((video, idx) => {
                                    const rank = idx + 2; 
                                    return (
                                        <div key={video.id.videoId || video.id} onClick={() => window.location.hash = `#/video/${video.id.videoId || video.id}`} className={`flex flex-col cursor-pointer ${styles.card} ${styles.cardHover}`}>
                                            <div className={`relative bg-black aspect-video group overflow-hidden ${styles.isMoe ? 'rounded-t-3xl' : 'border-b-4 border-current'}`}>
                                                <div className={`absolute top-0 left-0 z-10 px-3 py-1 ${styles.isMoe ? 'rounded-br-2xl' : 'border-r-4 border-b-4 border-black'} ${rank <= 3 ? (styles.isMoe ? 'bg-pink-400 text-white' : 'bg-red-500 text-white') : (styles.isMoe ? 'bg-white/90 text-black' : 'bg-white text-black')} font-display font-black text-2xl`}>
                                                    #{rank}
                                                </div>
                                                <img src={video.snippet.thumbnails.medium?.url} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                                
                                                <div className={`absolute bottom-2 right-2 flex flex-col items-end gap-1`}>
                                                    <div className="flex gap-1">
                                                        {video.parsedYume.season && <span className={`${styles.badge} text-xs px-2 py-0.5 bg-pink-500 text-white border-pink-700`}>SS {video.parsedYume.season}</span>}
                                                        {video.parsedYume.episode && <span className={`${styles.badge} text-xs px-2 py-0.5 bg-blue-500 text-white border-blue-700`}>EP {video.parsedYume.episode}</span>}
                                                    </div>
                                                    <span className={`${styles.badge} text-xs px-2 py-0.5`}>{video.contentDetails?.duration ? video.contentDetails.duration.replace('PT','').replace('H',':').replace('M',':').replace('S','') : ''}</span>
                                                </div>
                                            </div>
                                            <div className="p-4 flex-1 flex flex-col justify-between relative">
                                                <h3 className={`font-display text-xl leading-tight line-clamp-2 mb-2 ${styles.text}`} title={video.snippet.localized?.title || video.snippet.title}>
                                                    {video.parsedYume.baseTitle}
                                                </h3>
                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className={`font-sans text-sm font-bold truncate w-2/3 ${styles.textMuted}`}>{video.snippet.channelTitle}</span>
                                                        <span className={`font-display text-sm px-2 ${styles.isMoe ? 'bg-pink-100 text-pink-600 rounded-lg' : 'bg-zinc-200 text-black border-2 border-black'}`}>{timeAgo(video.snippet.publishedAt)}</span>
                                                    </div>
                                                    <div className={`flex justify-between items-center pt-2 mt-2 ${styles.isMoe ? 'border-t-2 border-pink-100' : 'border-t-2 border-current'}`}>
                                                        <span className={`font-display font-black ${styles.text}`}>{formatNumber(video.statistics?.viewCount)} View</span>
                                                        <span className={`font-display font-black text-red-500 flex items-center gap-1`}><Icons.Zap/> {Math.round(video.yumeRankScore)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function ChannelDetailView({ channelId, apiKey, t, styles, lang }) {
    const [channelStats, setChannelStats] = useState(null);
    const [latestVideos, setLatestVideos] = useState([]);
    const [popularSeries, setPopularSeries] = useState([]);
    const [expandedSeries, setExpandedSeries] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fallbackBanner, setFallbackBanner] = useState(null);
    const [showShare, setShowShare] = useState(false);

    useEffect(() => {
        const fetchChannelData = async () => {
            setLoading(true);
            try {
                let url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings,contentDetails&hl=${lang}&key=${apiKey}`;
                if (channelId.startsWith('@')) url += `&forHandle=${channelId}`; else url += `&id=${channelId}`;

                const cData = await fetchWithCache(url, `ch_full_${channelId}_${lang}`, 1440);
                if (cData.items && cData.items.length > 0) {
                    const currentChannel = cData.items[0];
                    setChannelStats(currentChannel);
                    
                    if (!currentChannel.brandingSettings?.image?.bannerExternalUrl) {
                        fetchAnimeImage('wallpaper', `banner_${currentChannel.id}`).then(url => setFallbackBanner(url));
                    }

                    const realChannelId = currentChannel.id;
                    const uploadPlaylistId = currentChannel.contentDetails?.relatedPlaylists?.uploads;

                    if (uploadPlaylistId) {
                        const vLatest = await fetchWithCache(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadPlaylistId}&maxResults=15&key=${apiKey}`, `ch_lat_${realChannelId}`, 30);
                        if (vLatest.items && vLatest.items.length > 0) {
                            const vIds = vLatest.items.map(i=>i.snippet.resourceId.videoId).join(',');
                            const vStats = await fetchWithCache(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${vIds}&hl=${lang}&key=${apiKey}`, `vids_lat_${realChannelId}_${lang}`, 30);
                            setLatestVideos((vStats.items || []).filter(v => isNotShort(v)).slice(0, 5));
                        }
                    }

                    const vPop = await fetchWithCache(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${realChannelId}&order=viewCount&maxResults=50&type=video&key=${apiKey}`, `ch_pop_series_${realChannelId}`, 1440);
                    if (vPop.items && vPop.items.length > 0) {
                        const vIds = vPop.items.map(i=>i.id.videoId).join(',');
                        const vStats = await fetchWithCache(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${vIds}&hl=${lang}&key=${apiKey}`, `vids_pop_series_${realChannelId}_${lang}`, 1440);
                        
                        const validVideos = (vStats.items || []).filter(v => isNotShort(v));
                        const seriesMap = {};
                        validVideos.forEach(v => {
                            const parsed = parseAnimeTitle(v.snippet.localized?.title || v.snippet.title);
                            const bTitle = parsed.baseTitle;
                            const sSeason = parsed.season || '';
                            const key = `${bTitle}_${sSeason}`;
                            if (!seriesMap[key] && bTitle) {
                                seriesMap[key] = { title: bTitle, season: sSeason, views: 0, thumbnail: v.snippet.thumbnails?.medium?.url || '', videos: [] };
                            }
                            if (seriesMap[key]) {
                                seriesMap[key].views += parseInt(v.statistics.viewCount || 0);
                                seriesMap[key].videos.push({ ...v, parsedYume: parsed });
                            }
                        });

                        const sortedSeries = Object.values(seriesMap).sort((a, b) => b.views - a.views).slice(0, 5);
                        
                        const plRes = await fetchWithCache(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${realChannelId}&maxResults=50&key=${apiKey}`, `ch_pls_pop_${realChannelId}`, 1440);
                        const channelPlaylists = plRes.items || [];
                        
                        for (let series of sortedSeries) {
                            const sTitleLower = series.title.toLowerCase().trim();
                            const matchedPl = channelPlaylists.find(pl => {
                                const plTitle = pl.snippet.title.toLowerCase();
                                return plTitle.includes(sTitleLower) || sTitleLower.includes(plTitle);
                            });
                            
                            if (matchedPl) {
                                let itemToken = '';
                                let plVideoIds = [];
                                for (let i = 0; i < 3; i++) { 
                                    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${matchedPl.id}&maxResults=50&key=${apiKey}${itemToken ? '&pageToken='+itemToken : ''}`;
                                    const itemsRes = await fetchWithCache(url, `pl_items_pop_${matchedPl.id}_p${i}`, 1440);
                                    if (!itemsRes || !itemsRes.items) break;
                                    itemsRes.items.forEach(item => {
                                        if (item.snippet.resourceId.videoId) plVideoIds.push(item.snippet.resourceId.videoId);
                                    });
                                    itemToken = itemsRes.nextPageToken;
                                    if (!itemToken) break;
                                }
                                
                                if (plVideoIds.length > 0) {
                                    const uniqueIds = [...new Set(plVideoIds)];
                                    let statsItems = [];
                                    for (let i = 0; i < uniqueIds.length; i += 50) {
                                        const chunk = uniqueIds.slice(i, i + 50).join(',');
                                        const statsData = await fetchWithCache(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${chunk}&hl=${lang}&key=${apiKey}`, `stats_pop_chunk_${chunk}`, 1440);
                                        if (statsData.items) statsItems = [...statsItems, ...statsData.items];
                                    }
                                    
                                    const fullVideos = statsItems.filter(v => isNotShort(v)).map(v => ({
                                        ...v, parsedYume: parseAnimeTitle(v.snippet.localized?.title || v.snippet.title)
                                    })).filter(v => (v.parsedYume.season || '') === series.season);
                                    
                                    const existingIds = new Set(series.videos.map(v => v.id));
                                    fullVideos.forEach(v => {
                                        if (!existingIds.has(v.id)) series.videos.push(v);
                                    });
                                }
                            }
                            
                            series.videos.sort((a, b) => {
                                const epA = a.parsedYume.episode ? parseFloat(a.parsedYume.episode) : 999;
                                const epB = b.parsedYume.episode ? parseFloat(b.parsedYume.episode) : 999;
                                return epA - epB;
                            });
                        }
                        
                        setPopularSeries(sortedSeries);
                    }
                }
            } catch (e) { } finally { setLoading(false); }
        };
        if(channelId) fetchChannelData();
    }, [channelId, apiKey, lang]);

    if (loading) return <div className="flex-1 flex justify-center items-center py-20"><AnimeComponent type="dance" text={t('loading')} styles={styles}/></div>;
    if (!channelStats) return <div className="flex-1 flex items-center justify-center py-20"><AnimeComponent type="cry" text="Lỗi tải dữ liệu kênh" styles={styles}/></div>;

    const snippet = channelStats.snippet; const stats = channelStats.statistics;
    const banner = channelStats.brandingSettings?.image?.bannerExternalUrl || fallbackBanner;
    
    const subs = parseInt(stats.subscriberCount) || 1; const views = parseInt(stats.viewCount) || 0; const videoCount = parseInt(stats.videoCount) || 1;
    const viewSubRatio = (views / subs).toFixed(1); const avgViews = Math.round(views / videoCount);

    const barChartData = latestVideos.map(v => {
        const parsed = parseAnimeTitle(v.snippet.localized?.title || v.snippet.title);
        return { 
            id: v.id,
            label: parsed.baseTitle.substring(0, 10), 
            fullTitle: parsed.baseTitle,
            value: parseInt(v.statistics?.viewCount || 0),
            thumbnail: v.snippet.thumbnails.medium?.url
        }
    });

    return (
        <div className="flex-1 overflow-y-auto h-[calc(100vh-64px)] pb-20 md:pb-6 animate-fade-in relative">
            <div className={`w-full h-48 md:h-72 bg-zinc-900 relative ${styles.isMoe ? '' : 'border-b-4 border-black'}`}>
                {banner ? <img src={banner} className="w-full h-full object-cover opacity-90 grayscale hover:grayscale-0 transition-all duration-500" /> : <div className="w-full h-full halftone-dark"></div>}
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-20 relative z-10">
                <div className={`p-6 flex flex-col md:flex-row items-center md:items-end gap-6 mb-8 ${styles.card}`}>
                    <img src={snippet.thumbnails.high?.url} className={`w-32 h-32 md:w-40 md:h-40 shrink-0 object-cover ${styles.imgWrap} bg-white`} />
                    <div className="flex-1 text-center md:text-left mb-2">
                        <h1 className={`text-4xl md:text-5xl font-display font-black uppercase tracking-wide ${styles.text}`}>{snippet.localized?.title || snippet.title}</h1>
                        <p className={`text-xl font-sans mt-1 ${styles.textMuted}`}>{snippet.customUrl}</p>
                    </div>
                    <div className="flex gap-2">
                        <div className={`px-4 py-2 text-xl cursor-help ${styles.badge}`} title={formatExactNumber(stats.subscriberCount)}>
                            {formatNumber(stats.subscriberCount)} {t('total_subs')}
                        </div>
                        <button onClick={() => setShowShare(true)} className={`px-4 py-2 flex items-center gap-2 ${styles.btn}`}>
                            <Icons.Share />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start mb-10">
                    <div className="w-full lg:w-1/3 flex flex-col gap-4">
                        <StatBadge title={t('view_to_sub')} value={viewSubRatio} exactValue={t('view_to_sub_desc')} icon={<Icons.User/>} styles={styles} accent={true} />
                        <StatBadge title={t('avg_views')} value={formatNumber(avgViews)} exactValue={formatExactNumber(avgViews)} icon={<Icons.Eye/>} styles={styles} />
                        <StatBadge title={t('total_videos')} value={formatNumber(stats.videoCount)} exactValue={formatExactNumber(stats.videoCount)} icon={<Icons.Play/>} styles={styles} />
                    </div>

                    <div className={`w-full lg:w-2/3 p-6 ${styles.card}`}>
                        <h2 className={`text-2xl font-display uppercase font-black ${styles.text} border-b-2 border-current pb-2`}>{t('latest_compare')}</h2>
                        {barChartData.length > 0 ? (
                            <MangaBarChart data={barChartData} styles={styles} />
                        ) : <div className="h-48 flex items-center justify-center">Không có dữ liệu</div>}
                    </div>
                </div>

                <h2 className={`text-3xl font-display uppercase font-black mb-6 ${styles.text} ${styles.isMoe ? 'text-pink-500' : 'border-b-4 border-current pb-2'}`}>{t('channel_top_videos')}</h2>
                <div className="flex flex-col gap-6">
                    {popularSeries.map((series, i) => {
                        const seriesKey = `${series.title}_${series.season}`;
                        const isExpanded = expandedSeries === seriesKey;
                        return (
                            <div key={seriesKey} className={`flex flex-col overflow-hidden transition-all ${styles.card} ${!isExpanded ? styles.cardHover : ''}`}>
                                <div onClick={() => setExpandedSeries(isExpanded ? null : seriesKey)} className={`flex flex-col md:flex-row cursor-pointer p-0`}>
                                    <div className={`relative shrink-0 bg-black ${styles.imgWrap} w-full md:w-[320px] aspect-video border-0 rounded-none`}>
                                        {i === 0 && <div className="absolute -top-4 -left-4 z-10 text-5xl rotate-[-20deg] drop-shadow-md">👑</div>}
                                        <div className={`absolute top-2 left-2 px-2 py-1 z-10 ${i === 0 ? 'bg-yellow-400 text-black font-display font-black text-2xl border-4 border-black' : styles.badge}`}>#{i+1}</div>
                                        <img src={series.thumbnail} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <span className={`px-4 py-2 text-lg font-display uppercase ${styles.badge}`}>{isExpanded ? 'Đóng' : t('click_to_expand')}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center min-w-0 p-6 md:p-8">
                                        <h3 className={`font-display text-2xl md:text-3xl line-clamp-2 leading-tight ${styles.text}`}>
                                            {series.title} {series.season && <span className="text-pink-500 text-xl ml-2">SS{series.season}</span>}
                                        </h3>
                                        <div className="flex items-center gap-6 mt-4">
                                            <div>
                                                <div className={`text-sm font-display uppercase ${styles.textMuted}`}>{t('total_series_views')}</div>
                                                <div className={`font-display text-2xl text-red-500 font-black`}>{formatNumber(series.views)}</div>
                                            </div>
                                            <div>
                                                <div className={`text-sm font-display uppercase ${styles.textMuted}`}>Số tập hot</div>
                                                <div className={`font-display text-2xl ${styles.text} font-black`}>{series.videos.length}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`p-6 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                        <Icons.ChevronDown />
                                    </div>
                                </div>
                                
                                {isExpanded && (
                                    <div className={`p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 ${styles.isMoe ? 'bg-pink-50 border-t-2 border-pink-200' : 'bg-zinc-100 border-t-4 border-black'}`}>
                                        {series.videos.map(v => (
                                            <div key={v.id} onClick={() => window.location.hash = `#/video/${v.id}`} className={`cursor-pointer group flex flex-col`}>
                                                <div className={`w-full aspect-video bg-black overflow-hidden relative ${styles.imgWrap}`}>
                                                    <img src={v.snippet.thumbnails.medium?.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                    <div className={`absolute bottom-1 right-1 flex gap-1`}>
                                                        {v.parsedYume.season && <span className={`px-2 py-0.5 text-xs bg-pink-500 text-white font-display border-2 border-pink-700`}>SS {v.parsedYume.season}</span>}
                                                        {v.parsedYume.episode && <span className={`px-2 py-0.5 text-xs bg-blue-500 text-white font-display border-2 border-blue-700`}>EP {v.parsedYume.episode}</span>}
                                                    </div>
                                                </div>
                                                <div className={`font-display mt-2 line-clamp-2 text-sm ${styles.text}`}>{v.parsedYume.baseTitle}</div>
                                                <div className={`font-sans text-xs text-red-500 font-bold mt-1`}>{formatNumber(v.statistics.viewCount)} View</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {showShare && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 animate-fade-in" onClick={() => setShowShare(false)}>
                    <div className={`w-full max-w-lg p-8 ${styles.card} flex flex-col`} onClick={e => e.stopPropagation()}>
                        <h3 className={`text-3xl font-display uppercase font-black mb-8 border-b-2 border-current pb-2 ${styles.text}`}>{t('share')}</h3>
                        <div className="space-y-6 mb-10">
                            <div>
                                <label className={`text-lg font-display uppercase mb-2 block ${styles.textMuted}`}>{t('share_yume')}</label>
                                <div className="flex gap-2">
                                    <input type="text" readOnly value={window.location.href} className={`flex-1 px-4 py-2 outline-none font-sans text-lg ${styles.input}`} />
                                    <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert(t('copied')); }} className={`px-6 py-2 ${styles.btn}`}>Copy</button>
                                </div>
                            </div>
                            <div>
                                <label className={`text-lg font-display uppercase mb-2 block ${styles.textMuted}`}>{t('share_yt')}</label>
                                <div className="flex gap-2">
                                    <input type="text" readOnly value={`https://youtube.com/channel/${channelId}`} className={`flex-1 px-4 py-2 outline-none font-sans text-lg ${styles.input}`} />
                                    <button onClick={() => { navigator.clipboard.writeText(`https://youtube.com/channel/${channelId}`); alert(t('copied')); }} className={`px-6 py-2 ${styles.btn}`}>Copy</button>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setShowShare(false)} className={`w-full py-4 font-display uppercase text-xl ${styles.isMoe ? 'bg-slate-200 text-slate-800 rounded-2xl' : 'border-4 border-current bg-white text-black'} transition-transform hover:-translate-y-1`}>{t('cancel')}</button>
                    </div>
                </div>
            )}
        </div>
    );
}

function VideoDetailView({ videoId, apiKey, t, styles, lang, favorites, toggleFavorite, pushHistory, isAdmin }) {
    const [video, setVideo] = useState(null);
    const [channel, setChannel] = useState(null);
    const [topComment, setTopComment] = useState(null);
    const [dislikes, setDislikes] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [nextEpisodes, setNextEpisodes] = useState([]);    // Feature 28
    const [loading, setLoading] = useState(true);
    const [showShare, setShowShare] = useState(false);
    const [assignModal, setAssignModal] = useState(false);  // Feature 29

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const ytData = await fetchWithCache(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&hl=${lang}&key=${apiKey}`, `v_${videoId}_${lang}`, 15);
                let vData = null;
                if (ytData.items && ytData.items.length > 0) { vData = ytData.items[0]; setVideo(vData); pushHistory(vData); }

                if (vData) {
                    fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`).then(res => res.json()).then(data => setDislikes(data.dislikes)).catch(()=>setDislikes(null));
                    const cData = await fetchWithCache(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${vData.snippet.channelId}&hl=${lang}&key=${apiKey}`, `c_${vData.snippet.channelId}_${lang}`, 1440);
                    if(cData.items) setChannel(cData.items[0]);

                    try {
                        const cmData = await fetchWithCache(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&order=relevance&maxResults=1&hl=${lang}&key=${apiKey}`, `cm_${videoId}_${lang}`, 5);
                        if(cmData.items && cmData.items.length > 0) setTopComment(cmData.items[0].snippet.topLevelComment.snippet);
                    } catch(e){}

                    const parsed = parseAnimeTitle(vData.snippet.localized?.title || vData.snippet.title);
                    if (parsed.baseTitle) {
                        // Feature 28 — Fetch next episodes from Firestore DB
                        try {
                            const epSnap = await firebase.firestore().collection('anime_series').get();
                            let foundSeries = null;
                            const currentEpNum = parsed.episode ? parseFloat(parsed.episode) : null;
                            const currentSeason = parsed.season || '';
                            const normalizedBase = parsed.baseTitle.toLowerCase().trim();

                            epSnap.docs.forEach(doc => {
                                const d = doc.data();
                                if (!foundSeries && d.title) {
                                    const docBase = d.title.toLowerCase().trim();
                                    // Match by title similarity and season
                                    if ((docBase === normalizedBase || docBase.includes(normalizedBase) || normalizedBase.includes(docBase)) &&
                                        (d.season || '') === currentSeason) {
                                        foundSeries = { ...d, docId: doc.id };
                                    }
                                }
                            });

                            if (foundSeries && foundSeries.videos && currentEpNum !== null) {
                                // Sort all episodes
                                const parseEpNum = (ep) => {
                                    if (!ep) return { n: 9999, sub: '' };
                                    const m = String(ep).match(/^(\d+(?:\.\d+)?)([A-Za-z]?)$/);
                                    return m ? { n: parseFloat(m[1]), sub: (m[2]||'').toLowerCase() } : { n: 9999, sub: '' };
                                };
                                const sorted = [...foundSeries.videos].sort((a, b) => {
                                    const ea = parseEpNum(a.episode), eb = parseEpNum(b.episode);
                                    return ea.n !== eb.n ? ea.n - eb.n : ea.sub.localeCompare(eb.sub);
                                });
                                // Find current video index
                                const currentIdx = sorted.findIndex(v => v.videoId === videoId);
                                if (currentIdx >= 0) {
                                    // Take up to 5 episodes after current
                                    const nexts = sorted.slice(currentIdx + 1, currentIdx + 6);
                                    setNextEpisodes(nexts);
                                } else {
                                    // Fallback: most recent 5 by publishedAt
                                    const recent = [...foundSeries.videos]
                                        .filter(v => v.videoId !== videoId)
                                        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
                                        .slice(0, 5);
                                    setNextEpisodes(recent);
                                }
                            }
                        } catch(e) {}

                        // Existing: same-series recommendations from YouTube search
                        try {
                            const recSearch = await fetchWithCache(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(parsed.baseTitle)}&type=video&channelId=${vData.snippet.channelId}&maxResults=5&key=${apiKey}`, `rec_${parsed.baseTitle}_${vData.snippet.channelId}`, 1440);
                            if (recSearch.items) setRecommendations(recSearch.items.filter(i => i.id.videoId !== videoId));
                        } catch(e){}
                    }
                }
            } catch (err) { } finally { setLoading(false); }
        };
        fetchDetails();
    }, [videoId, apiKey, lang, pushHistory]);

    if (loading) return <div className="flex-1 flex justify-center items-center py-20"><AnimeComponent type="dance" text={t('loading')} styles={styles}/></div>;
    if (!video) return <div className="flex-1 flex justify-center items-center py-20"><AnimeComponent type="cry" text={t('no_data')} styles={styles}/></div>;

    const isFav = favorites.some(v => v.id === videoId || (v.id.videoId && v.id.videoId === videoId));
    
    let yumeDetails = { score: 0, rank: 'D', speed: 0, power: 0, base: 0 };
    let avgViews = 0;
    if (channel) {
        yumeDetails = calculateYumeScoreDetails(
            video.statistics?.viewCount,
            video.statistics?.likeCount,
            null, null, null, // removed: channelSubs, totalViews, videoCount
            video.snippet.publishedAt
        );
        avgViews = Math.round((parseInt(channel.statistics?.viewCount)||0) / Math.max(1, parseInt(channel.statistics?.videoCount)||1));
    }

    const videoViews = parseInt(video.statistics?.viewCount || 0);
    const performanceRatio = avgViews > 0 ? (videoViews / avgViews) : 0;
    const parsedData = parseAnimeTitle(video.snippet.localized?.title || video.snippet.title);
    const videoDesc = video.snippet.localized?.description || video.snippet.description;

    return (
        <div className="flex-1 overflow-y-auto h-[calc(100vh-64px)] pb-20 md:pb-6 animate-fade-in relative">
            {/* ===== EMBEDDED PLAYER HERO SECTION ===== */}
            <div className={`relative ${styles.isMoe ? 'bg-gradient-to-b from-pink-100/80 to-transparent' : 'bg-zinc-950'}`}>
                {/* YouTube IFrame Embed */}
                <div className="w-full max-w-6xl mx-auto px-0 md:px-8 pt-0 md:pt-6">
                    <div className={`relative w-full aspect-video overflow-hidden shadow-2xl ${styles.isMoe ? 'md:rounded-3xl border-2 border-pink-200' : 'md:border-4 md:border-white'}`}>
                        <iframe
                            key={videoId}
                            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&color=white&iv_load_policy=3`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="w-full h-full absolute inset-0"
                            title={parsedData.baseTitle}
                        />
                    </div>
                </div>

                {/* Title / Meta below player */}
                <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <div className={`px-3 py-1 font-display uppercase text-sm ${styles.isMoe ? 'bg-white text-pink-500 rounded-full border border-pink-200' : 'border-2 border-current text-current bg-transparent'}`}>
                            {new Date(video.snippet.publishedAt).toLocaleDateString('vi-VN')}
                        </div>
                        {parsedData.season && <div className="px-3 py-1 font-display uppercase text-sm bg-pink-500 text-white border-2 border-pink-700">SS {parsedData.season}</div>}
                        {parsedData.episode && <div className="px-3 py-1 font-display uppercase text-sm bg-blue-500 text-white border-2 border-blue-700">EP {parsedData.episode}</div>}
                    </div>
                    <h1 className={`text-2xl md:text-4xl font-display font-black leading-snug mb-4 ${styles.text}`}>{parsedData.baseTitle}</h1>

                    <div className="flex flex-wrap gap-3 items-center">
                        {channel && (
                            <div onClick={() => window.location.hash = `#/channel/${channel.id}`} className={`flex items-center gap-3 p-3 cursor-pointer transition-transform hover:-translate-y-1 ${styles.isMoe ? 'bg-white/80 rounded-2xl border-2 border-pink-200 shadow-sm' : 'border-2 border-current'}`}>
                                <img src={channel.snippet.thumbnails.default?.url} className={`w-10 h-10 object-cover ${styles.isMoe ? 'rounded-full border-2 border-pink-300' : 'border-2 border-current'}`} />
                                <div>
                                    <div className={`font-display font-black ${styles.text}`}>{channel.snippet.localized?.title || channel.snippet.title}</div>
                                    <div className={`font-sans text-sm ${styles.isMoe ? 'text-pink-500 font-bold' : 'text-yellow-400'}`}>{formatNumber(channel.statistics?.subscriberCount)} {t('total_subs')}</div>
                                </div>
                            </div>
                        )}
                        <button onClick={() => toggleFavorite(video)} className={`flex items-center gap-2 px-5 py-3 font-display uppercase transition-transform hover:-translate-y-1 ${isFav ? (styles.isMoe ? 'bg-pink-500 text-white rounded-2xl' : 'bg-red-500 text-white border-2 border-current') : (styles.isMoe ? 'bg-white text-pink-500 rounded-2xl border-2 border-pink-300' : 'border-2 border-current text-current')}`}>
                            <Icons.Heart filled={isFav} /> {isFav ? t('my_favorites') : t('save')}
                        </button>
                        <button onClick={() => setShowShare(true)} className={`flex items-center gap-2 px-5 py-3 font-display uppercase transition-transform hover:-translate-y-1 ${styles.isMoe ? 'bg-white text-slate-700 rounded-2xl border-2 border-pink-300' : 'border-2 border-current text-current'}`}>
                            <Icons.Share /> {t('share')}
                        </button>
                        <a href={`https://youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer"
                           className={`flex items-center gap-2 px-5 py-3 font-display uppercase transition-transform hover:-translate-y-1 ${styles.isMoe ? 'bg-red-500 text-white rounded-2xl' : 'bg-red-600 text-white border-2 border-red-800'}`}>
                            <Icons.Play /> {t('watch_yt')}
                        </a>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
                <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                    <div className={`w-full lg:w-1/3 p-6 flex flex-col items-center justify-between ${styles.card} relative overflow-hidden`}>
                        <div className="absolute top-2 right-2 text-6xl font-display font-black opacity-10 rotate-12 rank-S">{yumeDetails.rank}</div>
                        <div className="w-full text-center">
                            <h3 className={`text-3xl font-display uppercase font-black tracking-widest border-b-2 border-current pb-2 mb-2 ${styles.text}`}>{t('yume_score')}</h3>
                        </div>
                        <div className="my-4 w-full flex justify-center">
                            <MangaRadarChart data={[yumeDetails.speed, yumeDetails.power, yumeDetails.base]} labels={[t('chart_speed'), t('chart_power'), t('chart_base')]} styles={styles} />
                        </div>
                        <div className="flex items-end justify-center w-full">
                            <div className={`text-6xl font-display font-black ${styles.text}`}>{yumeDetails.score}<span className="text-2xl opacity-50">/100</span></div>
                            <div className={`text-7xl font-display font-black ml-4 rank-${yumeDetails.rank}`}>{yumeDetails.rank}</div>
                        </div>
                    </div>

                    <div className="w-full lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-6">
                        <StatBadge title={t('views')} value={formatNumber(video.statistics?.viewCount)} hoverTitle={formatExactNumber(video.statistics?.viewCount)} icon={<Icons.Eye/>} styles={styles} accent={true} />
                        <StatBadge title={t('vph')} value={getVPH(video.statistics?.viewCount, video.snippet.publishedAt)} exactValue={t('vph_desc')} icon={<Icons.Flame/>} styles={styles} accent={true} />
                        <StatBadge title={t('er')} value={getER(video.statistics?.viewCount, video.statistics?.likeCount, video.statistics?.commentCount)} exactValue={t('er_desc')} icon={<Icons.Chart/>} styles={styles} />
                        
                        <StatBadge title={t('likes')} value={formatNumber(video.statistics?.likeCount)} hoverTitle={formatExactNumber(video.statistics?.likeCount)} icon={<Icons.Heart filled={true}/>} styles={styles} />
                        <StatBadge title={t('dislikes')} value={dislikes !== null ? formatNumber(dislikes) : '?'} hoverTitle={dislikes !== null ? formatExactNumber(dislikes) : t('dislike_est')} icon={<Icons.ThumbDown/>} styles={styles} />
                        <StatBadge title={t('comments')} value={formatNumber(video.statistics?.commentCount)} hoverTitle={formatExactNumber(video.statistics?.commentCount)} icon={<Icons.Menu/>} styles={styles} />
                    </div>
                </div>

                {/* Feature 28 — Next Episodes (above recommendations) */}
                {nextEpisodes.length > 0 && (
                    <div className={`p-6 ${styles.card}`}>
                        <h3 className={`text-2xl font-display uppercase font-black border-b-2 border-current pb-2 mb-4 ${styles.text}`}>
                            ▶ {t('next_episodes')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {nextEpisodes.map(ep => (
                                <div key={ep.videoId}
                                    onClick={() => window.location.hash = `#/video/${ep.videoId}`}
                                    className={`cursor-pointer group flex flex-col ${styles.isMoe ? 'hover:scale-105 transition-transform' : 'hover:-translate-y-1 transition-transform'}`}>
                                    <div className={`w-full aspect-video bg-black overflow-hidden relative ${styles.imgWrap}`}>
                                        <img src={ep.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                        {ep.episode && (
                                            <div className={`absolute bottom-1 right-1 px-2 py-0.5 text-xs font-display font-black ${styles.isMoe ? 'bg-pink-500 text-white rounded-lg' : 'bg-black text-white border border-white'}`}>
                                                EP {ep.episode}
                                            </div>
                                        )}
                                    </div>
                                    <div className={`font-display mt-2 line-clamp-2 text-sm leading-snug ${styles.text}`}>{ep.title}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Feature 29 — Admin SS/EP assignment button */}
                {isAdmin && (
                    <div className="flex justify-end">
                        <button onClick={() => setAssignModal(true)}
                            className={`flex items-center gap-2 px-5 py-2 font-display uppercase text-sm ${styles.isMoe ? 'bg-purple-500 text-white rounded-full' : 'bg-zinc-800 text-white border-2 border-zinc-600 hover:border-white'}`}>
                            <Icons.Pencil /> {t('assign_ep')}
                        </button>
                    </div>
                )}

                {recommendations.length > 0 && (
                    <div className={`p-6 ${styles.card}`}>
                        <h3 className={`text-2xl font-display uppercase font-black border-b-2 border-current pb-2 mb-4 ${styles.text} text-pink-500`}>{t('recommended')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {recommendations.map(rec => {
                                const recParsed = parseAnimeTitle(rec.snippet.title);
                                return (
                                    <div key={rec.id.videoId} onClick={() => window.location.hash = `#/video/${rec.id.videoId}`} className={`cursor-pointer group flex flex-col`}>
                                        <div className={`w-full aspect-video bg-black overflow-hidden relative ${styles.imgWrap}`}>
                                            <img src={rec.snippet.thumbnails.medium?.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                            <div className={`absolute bottom-1 right-1 flex gap-1`}>
                                                {recParsed.season && <span className={`px-2 py-0.5 text-xs bg-pink-500 text-white font-display border-2 border-pink-700`}>SS {recParsed.season}</span>}
                                                {recParsed.episode && <span className={`px-2 py-0.5 text-xs bg-blue-500 text-white font-display border-2 border-blue-700`}>EP {recParsed.episode}</span>}
                                            </div>
                                        </div>
                                        <div className={`font-display mt-2 line-clamp-2 ${styles.text}`}>{recParsed.baseTitle}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-6">
                    {channel && (
                        <div className={`lg:w-1/2 p-6 flex flex-col gap-6 ${styles.card}`}>
                            <h3 className={`text-2xl font-display uppercase font-black border-b-2 border-current pb-2 ${styles.text}`}>{t('channel_analytics')}</h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-end mb-1">
                                        <span className={`font-display uppercase text-lg ${styles.textMuted}`}>{t('avg_views')}</span>
                                        <span className={`font-display text-2xl font-black ${styles.text}`}>{formatNumber(avgViews)}</span>
                                    </div>
                                    <div className={`w-full h-6 relative ${styles.isMoe ? 'bg-pink-100 rounded-full overflow-hidden' : 'border-4 border-current bg-white shadow-[2px_2px_0px_rgba(0,0,0,0.5)]'}`}>
                                        <div className={`h-full ${styles.isMoe ? 'bg-pink-300' : 'bg-zinc-400'} progress-bar-fill`} style={{width: `${Math.min(100, (avgViews / Math.max(avgViews, videoViews)) * 100)}%`}}></div>
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between items-end mb-1">
                                        <span className={`font-display uppercase text-lg ${styles.accent}`}>{t('video_vs_avg')}</span>
                                        <div className="text-right">
                                            <span className={`font-display text-3xl font-black ${styles.text}`}>{formatNumber(videoViews)}</span>
                                            <span className={`font-display text-xl ml-2 px-2 ${styles.isMoe ? 'rounded-lg text-white' : 'border-2'} ${performanceRatio > 1 ? (styles.isMoe ? 'bg-green-400' : 'bg-black text-white border-green-500') : (styles.isMoe ? 'bg-red-400' : 'bg-black text-white border-red-500')}`}>
                                                {performanceRatio > 1 ? '+' : ''}{Math.round((performanceRatio - 1) * 100)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`w-full h-6 relative ${styles.isMoe ? 'bg-pink-100 rounded-full overflow-hidden' : 'border-4 border-current bg-white shadow-[2px_2px_0px_rgba(0,0,0,0.5)]'}`}>
                                        <div className={`h-full ${performanceRatio > 1 ? (styles.isMoe ? 'bg-green-400' : 'bg-red-500') : (styles.isMoe ? 'bg-pink-400' : 'bg-zinc-500')} progress-bar-fill`} style={{width: `${Math.min(100, (videoViews / Math.max(avgViews, videoViews)) * 100)}%`}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={`lg:w-1/2 p-6 flex flex-col ${styles.card}`}>
                        <h3 className={`text-2xl font-display uppercase font-black border-b-2 border-current pb-2 mb-4 ${styles.text}`}>{t('top_comment')}</h3>
                        {topComment ? (
                            <div className="flex gap-4">
                                <img src={topComment.authorProfileImageUrl} className={`w-14 h-14 shrink-0 object-cover ${styles.isMoe ? 'rounded-full border-2 border-pink-300' : 'border-2 border-current'}`} />
                                <div className="flex-1">
                                    <div className={`font-display text-lg mb-1 ${styles.textMuted}`}>{topComment.authorDisplayName}</div>
                                    <div className={`font-sans text-xl leading-relaxed ${styles.text}`} dangerouslySetInnerHTML={{__html: topComment.textDisplay}}></div>
                                    <div className={`font-display text-lg mt-3 flex items-center gap-1 ${styles.accent}`}>
                                        <Icons.Heart filled={true}/> {formatNumber(topComment.likeCount)}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={`flex-1 flex items-center justify-center font-sans text-xl ${styles.textMuted}`}>Bình luận đã bị tắt.</div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    <div className={`p-6 ${styles.card}`}>
                        <h3 className={`text-2xl font-display uppercase font-black border-b-2 border-current pb-2 mb-4 ${styles.text}`}>Mô tả Video</h3>
                        <div className={`pt-2 font-sans text-lg whitespace-pre-wrap leading-relaxed ${styles.text}`}>
                            {videoDesc}
                        </div>
                    </div>
                    {video.snippet.tags && video.snippet.tags.length > 0 && (
                        <div className={`p-6 ${styles.card}`}>
                            <h3 className={`text-2xl font-display uppercase font-black border-b-2 border-current pb-2 mb-4 ${styles.text}`}>{t('seo_tags')}</h3>
                            <div className="flex flex-wrap gap-2">
                                {video.snippet.tags.map(tag => (
                                    <span key={tag} className={`px-3 py-1 font-sans text-lg cursor-default ${styles.isMoe ? 'bg-pink-100 text-pink-600 rounded-lg' : 'border-2 border-current bg-zinc-200 text-black'}`}>#{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showShare && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 animate-fade-in" onClick={() => setShowShare(false)}>
                    <div className={`w-full max-w-lg p-8 ${styles.card} flex flex-col`} onClick={e => e.stopPropagation()}>
                        <h3 className={`text-3xl font-display uppercase font-black mb-8 border-b-2 border-current pb-2 ${styles.text}`}>{t('share')}</h3>
                        <div className="space-y-6 mb-10">
                            <div>
                                <label className={`text-lg font-display uppercase mb-2 block ${styles.textMuted}`}>{t('share_yume')}</label>
                                <div className="flex gap-2">
                                    <input type="text" readOnly value={window.location.href} className={`flex-1 px-4 py-2 outline-none font-sans text-lg ${styles.input}`} />
                                    <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert(t('copied')); }} className={`px-6 py-2 ${styles.btn}`}>Copy</button>
                                </div>
                            </div>
                            <div>
                                <label className={`text-lg font-display uppercase mb-2 block ${styles.textMuted}`}>{t('share_yt')}</label>
                                <div className="flex gap-2">
                                    <input type="text" readOnly value={`https://youtube.com/watch?v=${videoId}`} className={`flex-1 px-4 py-2 outline-none font-sans text-lg ${styles.input}`} />
                                    <button onClick={() => { navigator.clipboard.writeText(`https://youtube.com/watch?v=${videoId}`); alert(t('copied')); }} className={`px-6 py-2 ${styles.btn}`}>Copy</button>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setShowShare(false)} className={`w-full py-4 font-display uppercase text-xl ${styles.isMoe ? 'bg-slate-200 text-slate-800 rounded-2xl' : 'border-4 border-current bg-white text-black'} transition-transform hover:-translate-y-1`}>{t('cancel')}</button>
                    </div>
                </div>
            )}

            {/* Feature 29 — Admin SS/EP assign modal */}
            {assignModal && isAdmin && (
                <AssignMetaModal
                    videoId={videoId}
                    currentParsed={parsedData}
                    t={t}
                    styles={styles}
                    onClose={() => setAssignModal(false)}
                    onSaved={(ss, ep) => {
                        // Update parsedData display immediately via re-parse hint stored to state
                        // The DB write happens inside AssignMetaModal; page will reflect on next load
                        setAssignModal(false);
                    }}
                />
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════
// Feature 29 — Admin-controlled SS/EP assignment
// Writes to: anime_series collection (finds matching doc)
// Priority: admin override > auto-parsed > playlist order
// Protected by admin_overrides field on each video record
// ═══════════════════════════════════════════════════════
function AssignMetaModal({ videoId, currentParsed, t, styles, onClose, onSaved }) {
    const [season, setSeason] = useState(currentParsed?.season || '');
    const [episode, setEpisode] = useState(currentParsed?.episode || '');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Find the anime_series doc that contains this videoId
            const snap = await firebase.firestore().collection('anime_series').get();
            let targetDocId = null;
            let targetSeries = null;

            for (const doc of snap.docs) {
                const d = doc.data();
                if (d.videos?.some(v => v.videoId === videoId)) {
                    targetDocId = doc.id;
                    targetSeries = d;
                    break;
                }
            }

            if (!targetDocId || !targetSeries) {
                alert('Không tìm thấy video trong database Explore. Hãy thêm vào một playlist trước.');
                setSaving(false);
                return;
            }

            // Advanced episode sort helper
            const parseEpSort = (ep) => {
                if (!ep) return { n: 9999, sub: '' };
                const m = String(ep).match(/^(\d+(?:\.\d+)?)([A-Za-z]?)$/);
                return m ? { n: parseFloat(m[1]), sub: (m[2] || '').toLowerCase() } : { n: 9999, sub: '' };
            };

            // Build updated videos array with admin override applied
            const updatedVideos = targetSeries.videos.map(v => {
                if (v.videoId !== videoId) return v;
                return {
                    ...v,
                    episode: episode.trim() || v.episode,
                    season: season.trim() || v.season,
                    adminOverride: true,  // marks this as admin-assigned, skip auto-processing
                };
            });

            // Re-sort respecting admin overrides and sub-labels (1 → 1A → 1B → 2)
            updatedVideos.sort((a, b) => {
                const ea = parseEpSort(a.episode), eb = parseEpSort(b.episode);
                return ea.n !== eb.n ? ea.n - eb.n : ea.sub.localeCompare(eb.sub);
            });

            await firebase.firestore().collection('anime_series').doc(targetDocId).update({
                videos: updatedVideos,
                lastUpdated: new Date().toISOString(),
            });

            setSaved(true);
            setTimeout(() => { onSaved(season, episode); }, 1000);
        } catch (e) {
            alert('Lỗi lưu: ' + e.message);
        }
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 animate-fade-in" onClick={onClose}>
            <div className={`w-full max-w-md p-6 flex flex-col gap-5 ${styles.card}`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                    <h3 className={`text-xl font-display uppercase font-black flex items-center gap-2 ${styles.text}`}>
                        <Icons.Pencil /> {t('assign_ep')}
                    </h3>
                    <button onClick={onClose} className={styles.textMuted}><Icons.Close /></button>
                </div>

                <p className={`text-sm font-sans ${styles.textMuted}`}>
                    Admin override — sẽ không bị ghi đè bởi auto-sync trong tương lai.
                </p>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={`text-sm font-display uppercase mb-1 block ${styles.textMuted}`}>{t('assign_season')}</label>
                        <input
                            value={season}
                            onChange={e => setSeason(e.target.value)}
                            placeholder="1, 2, …"
                            className={`w-full px-4 py-3 font-sans text-lg outline-none ${styles.input}`}
                        />
                    </div>
                    <div>
                        <label className={`text-sm font-display uppercase mb-1 block ${styles.textMuted}`}>{t('assign_episode')}</label>
                        <input
                            value={episode}
                            onChange={e => setEpisode(e.target.value)}
                            placeholder="1, 2A, 2B, …"
                            className={`w-full px-4 py-3 font-sans text-lg outline-none ${styles.input}`}
                        />
                    </div>
                </div>

                <div className={`text-xs font-sans p-3 rounded-lg ${styles.isMoe ? 'bg-pink-50 text-pink-600 border border-pink-200' : 'bg-zinc-800 text-zinc-300 border border-zinc-700'}`}>
                    <strong>Thứ tự ưu tiên:</strong> Admin override → Auto-parse → Thứ tự playlist
                </div>

                <div className="flex gap-3">
                    <button onClick={onClose} className={`flex-1 py-3 font-display uppercase text-sm ${styles.isMoe ? 'bg-slate-200 text-slate-700 rounded-2xl' : 'border-2 border-current text-current'}`}>
                        {t('cancel')}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || saved}
                        className={`flex-1 py-3 font-display uppercase text-sm transition-colors ${saved ? 'bg-green-500 text-white' : styles.btn} disabled:opacity-60`}>
                        {saved ? '✅ ' + t('assign_done') : saving ? '⏳' : t('assign_save')}
                    </button>
                </div>
            </div>
        </div>
    );
}

function AccountView({ t, styles, favorites, setFavorites, history, setHistory, user, userDataReady, logout }) {
    const [tab, setTab] = useState('fav');
    const [confirmClear, setConfirmClear] = useState(false);
    useEffect(() => { if(!user) window.location.hash = '#/'; }, [user]);
    if(!user) return null;

    const persistToFirebase = (newFavs, newHist) => {
        if (userDataReady && typeof firebase !== 'undefined') {
            const update = {};
            if (newFavs !== undefined) update.favorites = newFavs;
            if (newHist !== undefined) update.history = newHist;
            firebase.firestore().collection("users").doc(user.email).set(update, { merge: true });
        }
    };

    const removeFromFavorites = (id) => {
        setFavorites(prev => {
            const next = prev.filter(v => (v.id.videoId || v.id) !== id);
            persistToFirebase(next, undefined);
            return next;
        });
    };

    const removeFromHistory = (id) => {
        setHistory(prev => {
            const next = prev.filter(v => (v.id?.videoId || v.id) !== id);
            persistToFirebase(undefined, next);
            return next;
        });
    };

    const clearAll = () => {
        if (tab === 'fav') { setFavorites([]); persistToFirebase([], undefined); }
        else { setHistory([]); persistToFirebase(undefined, []); }
        setConfirmClear(false);
    };

    const displayList = tab === 'fav' ? favorites : history;
    const clearLabel = tab === 'fav' ? t('clear_favorites') : t('clear_history');

    return (
        <div className="flex-1 overflow-y-auto h-[calc(100vh-64px)] pb-20 md:pb-6">
            <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
                <div className={`flex flex-col md:flex-row items-center md:items-start gap-8 mb-10 p-8 ${styles.card}`}>
                    <img src={user.avatar} className={`w-32 h-32 object-cover ${styles.isMoe ? 'rounded-full border-4 border-pink-300 shadow-md' : 'border-4 border-current'}`} />
                    <div className="flex-1 text-center md:text-left flex flex-col justify-center h-full">
                        <h1 className={`text-4xl md:text-5xl font-display font-black uppercase tracking-wider mb-2 ${styles.text}`}>{user.name}</h1>
                        <p className={`text-xl font-sans mb-6 ${styles.textMuted}`}>{user.email}</p>
                        <button onClick={() => { logout(); window.location.hash='#/'; }} className={`px-6 py-2 w-max transition-transform hover:-translate-y-1 font-display text-xl uppercase ${styles.isMoe ? 'bg-white text-pink-500 rounded-full border-2 border-pink-200 shadow-sm' : 'border-4 border-current shadow-manga bg-white text-black'}`}>
                            {t('logout')}
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-8 border-b-2 border-current pb-4 flex-wrap gap-3">
                    <div className="flex gap-4">
                        <button onClick={()=>setTab('fav')} className={`px-8 py-3 ${tab==='fav' ? styles.active : `border-2 border-transparent ${styles.text} hover:-translate-y-1 font-display text-xl uppercase transition-transform`}`}>{t('my_favorites')} ({favorites.length})</button>
                        <button onClick={()=>setTab('hist')} className={`px-8 py-3 ${tab==='hist' ? styles.active : `border-2 border-transparent ${styles.text} hover:-translate-y-1 font-display text-xl uppercase transition-transform`}`}>{t('my_history')} ({history.length})</button>
                    </div>
                    {displayList.length > 0 && (
                        <button onClick={() => setConfirmClear(true)} className={`flex items-center gap-2 px-5 py-2 font-display uppercase text-sm transition-transform hover:-translate-y-1 ${styles.isMoe ? 'text-red-400 border-2 border-red-300 rounded-full hover:bg-red-50' : 'text-red-500 border-2 border-red-500 hover:bg-red-50 hover:text-red-700'}`}>
                            <Icons.Trash /> {clearLabel}
                        </button>
                    )}
                </div>
                
                {displayList.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayList.map(video => {
                            const vid = video.id.videoId || video.id;
                            return (
                                <div key={vid} className={`relative p-3 flex flex-col ${styles.card} ${styles.cardHover} group`}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); tab === 'fav' ? removeFromFavorites(vid) : removeFromHistory(vid); }}
                                        className={`absolute top-3 right-3 z-10 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white hover:bg-red-600 shadow-md`}
                                        title={t('remove_item')}
                                    ><Icons.Trash /></button>
                                    <div onClick={() => window.location.hash = `#/video/${vid}`} className="cursor-pointer flex flex-col flex-1">
                                        <div className={`relative bg-black aspect-video w-full mb-3 ${styles.imgWrap}`}>
                                            <img src={video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url} loading="lazy" className="w-full h-full object-cover" />
                                        </div>
                                        <h3 className={`font-display text-xl line-clamp-2 leading-tight ${styles.text}`}>{video.snippet.localized?.title || video.snippet.title}</h3>
                                        <p className={`font-sans text-sm mt-2 ${styles.textMuted}`}>{video.snippet.channelTitle}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex justify-center"><AnimeComponent type="cry" text={t('no_data')} styles={styles} /></div>
                )}
            </div>

            {/* Confirm Clear Modal */}
            {confirmClear && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 animate-fade-in">
                    <div className={`w-full max-w-sm p-8 flex flex-col items-center ${styles.card}`}>
                        <div className="text-5xl mb-4">🗑️</div>
                        <h3 className={`text-2xl font-display font-black uppercase mb-4 text-center ${styles.text}`}>{t('confirm_clear')}</h3>
                        <p className={`text-lg font-sans text-center mb-6 ${styles.textMuted}`}>{clearLabel}</p>
                        <div className="flex gap-3 w-full">
                            <button onClick={() => setConfirmClear(false)} className={`flex-1 py-3 font-display uppercase ${styles.isMoe ? `${styles.card} ${styles.text} rounded-full` : 'border-4 border-current bg-white text-black'}`}>{t('cancel')}</button>
                            <button onClick={clearAll} className="flex-1 py-3 bg-red-500 text-white font-display uppercase border-2 border-red-700 hover:bg-red-600 transition-colors">{t('delete')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function SettingsModal({ close, applySettings, t, currentTheme, currentLang, currentRegion, routeMode, routeQuery }) {
    const [draftTheme, setDraftTheme] = useState(currentTheme);
    const [draftLang, setDraftLang] = useState(currentLang);
    const [draftRegion, setDraftRegion] = useState(currentRegion);
    const styles = getThemeStyles(draftTheme);

    const handleSave = () => {
        applySettings(draftLang, draftTheme, draftRegion);
        close();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 animate-fade-in">
            <div className={`w-full max-w-4xl p-6 md:p-8 flex flex-col ${styles.card} max-h-[90vh] overflow-hidden`}>
                <h2 className={`text-3xl md:text-4xl font-display font-black uppercase tracking-wider mb-6 text-center ${styles.text}`}>{t('settings')}</h2>
                
                <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                    <div className={`p-4 border-2 ${styles.isMoe ? 'border-pink-200 rounded-2xl' : 'border-current'} ${styles.bg}`}>
                        <label className={`text-lg font-display uppercase tracking-wider mb-3 block ${styles.textMuted}`}>{t('theme')}</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => setDraftTheme('sakura')} className={`p-2 font-display uppercase transition-all ${draftTheme==='sakura' ? 'bg-yellow-400 text-black border-2 border-black' : 'bg-zinc-100 text-black border-2 border-transparent'}`}>{t('theme_sakura')}</button>
                            <button onClick={() => setDraftTheme('cyber')} className={`p-2 font-display uppercase transition-all ${draftTheme==='cyber' ? 'bg-zinc-800 text-white border-2 border-white' : 'bg-zinc-600 text-white border-2 border-transparent'}`}>{t('theme_cyber')}</button>
                            <button onClick={() => setDraftTheme('moe')} className={`p-2 font-display uppercase transition-all ${draftTheme==='moe' ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl shadow-md' : 'bg-pink-100 text-pink-600 rounded-xl border-2 border-pink-200'}`}>{t('theme_moe')}</button>
                            <button onClick={() => setDraftTheme('moe_black')} className={`p-2 font-display uppercase transition-all ${draftTheme==='moe_black' ? 'bg-gradient-to-r from-pink-700 to-purple-900 text-pink-100 rounded-xl shadow-md' : 'bg-zinc-800 text-pink-400 rounded-xl border-2 border-pink-800'}`}>{t('theme_moe_black')}</button>
                        </div>
                    </div>

                    <div className={`p-4 border-2 ${styles.isMoe ? 'border-pink-200 rounded-2xl' : 'border-current'} ${styles.bg}`}>
                        <label className={`text-lg font-display uppercase tracking-wider mb-3 block ${styles.textMuted}`}>{t('language')}</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => setDraftLang('vi')} className={`p-2 font-display uppercase transition-all ${draftLang==='vi' ? styles.active : `border-2 border-transparent ${styles.isMoe ? `${styles.card} ${styles.text}` : 'bg-zinc-100 text-black'}`}`}>Tiếng Việt</button>
                            <button onClick={() => setDraftLang('en')} className={`p-2 font-display uppercase transition-all ${draftLang==='en' ? styles.active : `border-2 border-transparent ${styles.isMoe ? `${styles.card} ${styles.text}` : 'bg-zinc-100 text-black'}`}`}>English</button>
                            <button onClick={() => setDraftLang('ja')} className={`p-2 font-display uppercase transition-all ${draftLang==='ja' ? styles.active : `border-2 border-transparent ${styles.isMoe ? `${styles.card} ${styles.text}` : 'bg-zinc-100 text-black'}`}`}>日本語</button>
                        </div>
                    </div>

                    <div className={`p-4 border-2 ${styles.isMoe ? 'border-pink-200 rounded-2xl' : 'border-current'} ${styles.bg} md:col-span-2`}>
                        <label className={`text-lg font-display uppercase tracking-wider mb-3 block ${styles.textMuted}`}>Khu Vực (Region)</label>
                        <div className="flex gap-2">
                            <button onClick={() => setDraftRegion('VN')} className={`flex-1 p-3 font-display uppercase transition-all ${draftRegion==='VN' ? styles.active : `border-2 border-transparent ${styles.isMoe ? `${styles.card} ${styles.text}` : 'bg-zinc-100 text-black'}`}`}>Việt Nam</button>
                        </div>
                    </div>
                </div>

                <div className={`flex justify-end gap-4 pt-4 border-t-2 ${styles.isMoe ? 'border-pink-200' : 'border-current'} shrink-0`}>
                    <button onClick={close} className={`px-8 py-3 font-display uppercase text-lg transition-transform hover:-translate-y-1 ${styles.isMoe ? `${styles.card} ${styles.text} rounded-full` : 'border-4 border-current bg-white text-black'}`}>{t('cancel')}</button>
                    <button onClick={handleSave} className={`px-10 py-3 ${styles.btn}`}>{t('save')}</button>
                </div>
            </div>
        </div>
    );
}

export default function App() {
    const route = useHashRouter();
    const apiKey = HARDCODED_API_KEY;
    
    const [theme, setTheme] = useState(localStorage.getItem('ys_theme') || 'sakura');
    const [lang, setLang] = useState(() => {
        const stored = localStorage.getItem('ys_lang') || 'vi';
        return ['vi', 'en', 'ja'].includes(stored) ? stored : 'vi';
    });
    const [region, setRegion] = useState(() => {
        const stored = localStorage.getItem('ys_region') || 'VN';
        return stored === 'VN' ? 'VN' : 'VN'; // only VN supported
    });
    const [showSettings, setShowSettings] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [showTos, setShowTos] = useState(false);
    
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('ys_user')) || null);
    const [favorites, setFavorites] = useState([]);
    const [history, setHistory] = useState([]);
    const [userDataReady, setUserDataReady] = useState(false);
    
    const isAdmin = user && user.email === 'manikopvz@gmail.com';
    const t = (key) => (APP_DICTIONARY[lang] || APP_DICTIONARY['vi'])[key] || key;
    const styles = getThemeStyles(theme);

    // Feature 23B — Show ToS once per day
    useEffect(() => {
        const lastSeen = localStorage.getItem('ys_tos_seen');
        const now = Date.now();
        if (!lastSeen || now - parseInt(lastSeen) > 24 * 60 * 60 * 1000) {
            setShowTos(true);
        }
    }, []);

    useEffect(() => {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌸</text></svg>';
    }, []);

    useEffect(() => {
        document.documentElement.className = (theme === 'cyber' || theme === 'moe_black') ? 'dark' : '';
        document.body.className = `${styles.appBg} ${styles.text} antialiased h-screen overflow-hidden transition-colors duration-500`;
    }, [theme, styles]);

    useEffect(() => {
        if (user && FIREBASE_CONFIG.apiKey && typeof firebase !== 'undefined') {
            firebase.firestore().collection("users").doc(user.email).get().then((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    if(data.favorites) setFavorites(data.favorites);
                    if(data.history) setHistory(data.history);
                    if (data.settings) {
                        if (data.settings.theme) { setTheme(data.settings.theme); localStorage.setItem('ys_theme', data.settings.theme); }
                        if (data.settings.lang) { setLang(data.settings.lang); localStorage.setItem('ys_lang', data.settings.lang); }
                        if (data.settings.region) { setRegion(data.settings.region); localStorage.setItem('ys_region', data.settings.region); }
                    }
                }
                setUserDataReady(true);
            }).catch(() => setUserDataReady(true));
        } else {
            setUserDataReady(false); setFavorites([]); setHistory([]);
        }
    }, [user]);

    const toggleFavorite = (video) => {
        if(!user) { setShowLoginPrompt(true); return; }
        setFavorites(prev => {
            const exists = prev.find(v => (v.id.videoId || v.id) === (video.id.videoId || video.id));
            const newFavs = exists ? prev.filter(v => (v.id.videoId || v.id) !== (video.id.videoId || video.id)) : [video, ...prev];
            if (userDataReady && typeof firebase !== 'undefined') firebase.firestore().collection("users").doc(user.email).set({ favorites: newFavs }, { merge: true });
            return newFavs;
        });
    };

    const pushHistory = useCallback((video) => {
        setHistory(prev => {
            const filtered = prev.filter(v => (v.id?.videoId || v.id) !== (video.id?.videoId || video.id));
            const newHist = [video, ...filtered].slice(0, 50);
            if (userDataReady && user && typeof firebase !== 'undefined') firebase.firestore().collection("users").doc(user.email).set({ history: newHist }, { merge: true });
            return newHist;
        });
    }, [userDataReady, user]);

    const applySettings = (l, th, r) => { 
        const needReload = region !== r;
        setLang(l); setTheme(th); setRegion(r);
        localStorage.setItem('ys_lang', l); localStorage.setItem('ys_theme', th); localStorage.setItem('ys_region', r);
        if (user && typeof firebase !== 'undefined') firebase.firestore().collection("users").doc(user.email).set({ settings: { lang: l, theme: th, region: r } }, { merge: true });
        if (needReload) { sessionStorage.setItem('ys_force_refresh', 'true'); setTimeout(() => window.location.reload(), 300); }
    };

    useEffect(() => {
        if (sessionStorage.getItem('ys_force_refresh') === 'true') setTimeout(() => sessionStorage.removeItem('ys_force_refresh'), 2000);
    }, []);

    useEffect(() => {
        if (showLoginPrompt && !user && window.google) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: (response) => {
                    const base64 = response.credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
                    const payload = JSON.parse(decodeURIComponent(window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
                    const userData = { name: payload.name, avatar: payload.picture, email: payload.email };
                    setUser(userData); localStorage.setItem('ys_user', JSON.stringify(userData)); setShowLoginPrompt(false);
                }
            });
            setTimeout(() => { window.google.accounts.id.renderButton(document.getElementById("google_login_div"), { theme: "outline", size: "large", width: 250 }); }, 100);
        }
    }, [showLoginPrompt, user]);

    // Feature 24 — Auth gate: Search, Explore, Movies require login
    const GATED_MODES = [MODE_SEARCH, MODE_EXPLORE, MODE_MOVIES];
    const needsAuth = GATED_MODES.includes(route.mode) && !user;

    let CurrentPage;
    if (needsAuth) {
        CurrentPage = (
            <div className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in text-center">
                <div className="text-8xl mb-6">🔐</div>
                <h1 className={`text-4xl font-display font-black uppercase mb-4 ${styles.text}`}>{t('login_required')}</h1>
                <p className={`text-xl font-sans max-w-md mb-8 ${styles.textMuted}`}>{t('login_required_desc')}</p>
                <button onClick={() => setShowLoginPrompt(true)} className={`px-10 py-4 text-xl font-display uppercase ${styles.btn}`}>{t('account_title')}</button>
            </div>
        );
    } else if (route.mode === 'account') CurrentPage = <AccountView t={t} styles={styles} favorites={favorites} setFavorites={setFavorites} history={history} setHistory={setHistory} user={user} userDataReady={userDataReady} logout={()=>{setUser(null); localStorage.removeItem('ys_user');}} />;
    else if (route.mode === 'video') CurrentPage = <VideoDetailView videoId={route.id} apiKey={apiKey} t={t} styles={styles} lang={lang} favorites={favorites} toggleFavorite={toggleFavorite} pushHistory={pushHistory} isAdmin={isAdmin} />;
    else if (route.mode === 'channel') CurrentPage = <ChannelDetailView channelId={route.id} apiKey={apiKey} t={t} styles={styles} lang={lang} />;
    else if (route.mode === MODE_EXPLORE) CurrentPage = <ExploreView t={t} styles={styles} region={region} apiKey={apiKey} isAdmin={isAdmin} theme={theme} />;
    else CurrentPage = <HomeView route={route} apiKey={apiKey} t={t} styles={styles} lang={lang} region={region} isAdmin={isAdmin} />;

    return (
        <div className={`flex flex-col h-screen relative`}>
            {styles.isMoe && <MoeBackground theme={theme} />}
            <Header route={route} t={t} styles={styles} user={user} setShowLogin={setShowLoginPrompt} setShowSettings={setShowSettings} isAdmin={isAdmin} />
            <div className="flex flex-1 overflow-hidden relative z-10">{CurrentPage}</div>
            {route.mode !== 'video' && route.mode !== 'channel' && <MobileNav route={route} t={t} styles={styles} />}
            {showSettings && <SettingsModal close={() => setShowSettings(false)} applySettings={applySettings} t={t} currentTheme={theme} currentLang={lang} currentRegion={region} routeMode={route.mode} routeQuery={route.query} />}

            {/* Feature 23B — ToS (once per day) */}
            {showTos && (
                <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/70 p-4 animate-fade-in">
                    <div className={`w-full max-w-lg p-8 flex flex-col gap-5 ${styles.card}`}>
                        <div className="flex items-center gap-3">
                            <span className="text-4xl">📜</span>
                            <h2 className={`text-2xl font-display font-black uppercase ${styles.text}`}>{t('tos_title')}</h2>
                        </div>
                        <p className={`font-sans text-base leading-relaxed ${styles.textMuted}`}>{t('tos_body')}</p>
                        <div className="flex gap-3 flex-wrap">
                            <button onClick={() => { localStorage.setItem('ys_tos_seen', Date.now().toString()); setShowTos(false); }}
                                className={`flex-1 py-3 font-display uppercase text-sm ${styles.btn}`}>{t('tos_agree')}</button>
                            <button onClick={() => { localStorage.setItem('ys_tos_seen', Date.now().toString()); setShowTos(false); }}
                                className={`py-3 px-5 font-display uppercase text-sm ${styles.isMoe ? 'bg-slate-100 text-slate-700 rounded-full border border-slate-200' : 'border-2 border-current bg-transparent'} ${styles.text}`}>{t('tos_hide_day')}</button>
                        </div>
                    </div>
                </div>
            )}

            {showLoginPrompt && !user && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in">
                    <div className={`w-full max-w-sm p-8 relative flex flex-col items-center ${styles.card}`}>
                        <button onClick={() => setShowLoginPrompt(false)} className={`absolute top-4 right-4 p-2 transition-transform hover:scale-110 ${styles.text}`}><Icons.Close /></button>
                        <div className={`p-6 mb-6 ${styles.text} ${styles.isMoe ? 'bg-pink-100 text-pink-500 rounded-full' : 'border-4 border-current bg-zinc-200'}`}><Icons.User /></div>
                        <h2 className={`text-4xl font-display font-black uppercase tracking-wide mb-2 text-center ${styles.text}`}>{t('account_title')}</h2>
                        <p className={`text-xl font-sans text-center mb-8 ${styles.textMuted}`}>{t('login_prompt')}</p>
                        <div id="google_login_div" className="min-h-[40px]"></div>
                    </div>
                </div>
            )}
        </div>
    );
}
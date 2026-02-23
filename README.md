Landit Coding Test — 位置情報探索アプリ

・概要
提供されたスポットデータをデータベースへ自動インポートし、
地図上で周辺スポットを探索できるWebアプリケーションを実装しました。
ユーザーは地図操作を行いながら、
地図中心地点を基準とした半径検索
スポットのマーカー表示
地図と連動した一覧表示
をリアルタイムに確認できます。

・環境構築
必要環境
Docker / Docker Compose
Node.js (v18以上)
npm
リポジトリ取得
git clone https://github.com/<your-account>/landit-coding-test.git
cd landit-coding-test

・実行手順
① DB起動（PostgreSQL + PostGIS）
docker compose up -d
初回起動時に以下が自動実行されます。
PostgreSQL 起動
PostGIS Extension 有効化
CSVデータ自動インポート（Seed処理）
② Backend 起動（NestJS）
cd backend
PORT=3001 npm run start:dev
API:
http://localhost:3001/spots
③ Frontend 起動（Next.js）
cd frontend
npm run dev
ブラウザ:
http://localhost:3000

・使用した主要ライブラリと選定理由
Backend
技術	理由
NestJS	構造化されたDI設計により保守性の高いAPI構築が可能
TypeORM	EntityベースでDB構造とコードを同期可能
PostgreSQL	安定したRDBMS
PostGIS	地理空間検索（半径検索）を高速に実装可能
PostGISの ST_DWithin を利用し、
DBレベルで効率的な距離検索を実現しています。
Frontend
技術	理由
Next.js (App Router)	Reactベースで構成管理しやすい
Tailwind CSS	UI構築を高速化
Leaflet / React-Leaflet	軽量かつOSSで地図操作が容易
Google Maps APIに依存せず実装可能なため採用しました。
実装時に工夫した点・技術的判断

① Docker起動時のCSV自動インポート
アプリ起動直後から動作可能とするため、
NestJS OnModuleInit
Repository経由のSeed処理
を実装し、
docker compose up
のみでデータ投入が完了する構成としました。

② PostGISを用いた半径検索
アプリ側で距離計算を行うのではなく、
ST_DWithin()
を利用しDB側で検索処理を実行。
これにより：
不要なデータ転送削減
検索性能向上
スケーラビリティ確保
を実現しています。

③ 地図操作と検索結果の同期
地図移動終了 (moveend) をトリガーとして検索を実行し、
マーカー表示
スポット一覧
を常に同期させました。
④ API通信安定化への対応（エラー改善）
開発中に以下の問題が発生しました。
CORSによるAPI通信失敗
ポート競合（EADDRINUSE）
Leaflet画像解決エラー
SSR環境での window is not defined
これに対し、
NestJSでCORS設定を明示
Backend / Frontend ポート分離
Leafletアイコン読み込み修正
Client Component分離
を行い、安定した通信構成へ改善しました。
⑤ 不要なAPI呼び出し抑制
地図中心座標の変更時に
debounce処理
状態管理分離
を行い、過剰なAPIリクエストを防止しています。
時間の都合で簡略化した点 / 今後の改善
検索結果キャッシュの高度化
地図ズームレベルに応じた検索最適化
Marker clustering（大量データ対応）
Backend側キャッシュ導入（Redis等）
認証・ユーザー保存機能
システム構成
Next.js (Frontend)
        ↓
NestJS API
        ↓
PostgreSQL + PostGIS
動作イメージ
地図中心を移動
半径スライダー変更
周辺スポットがリアルタイム更新


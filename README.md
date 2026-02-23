# Landit Coding Test - 位置情報探索アプリ

## 概要
提供されたスポットデータをデータベースへ自動インポートし、地図上で周辺スポットを探索できるWebアプリケーションです。
ユーザーは地図操作を行いながら、以下の機能をリアルタイムに確認できます。
- 半径検索: 地図中心地点を基準としたスポットの絞り込み
- マーカー表示: 検索結果を地図上に可視化
- 一覧表示: 地図と連動したスポット情報のリスト表示

---

## 環境構築

### 必要環境
- Docker / Docker Compose
- Node.js (v18以上)
- npm

### リポジトリ取得
```
bash
```
git clone [https://github.com/aya1119/landit-coding-test.git](https://github.com/aya1119/landit-coding-test.git)
cd landit-coding-test

実行手順
1. データベースの起動（PostgreSQL + PostGIS）
まず、データの保存先となるデータベースを起動します。
Bash

docker compose up -d
※ 初回起動時に以下の処理が自動的に実行されます：
* PostgreSQLの起動
* PostGIS Extension（地理空間情報機能）の有効化
* CSVデータの自動インポート（Seed処理）
2. バックエンドの起動（NestJS）
別のターミナルを開き、APIサーバーを起動します。
Bash

cd backend
# 依存パッケージのインストール（初回のみ）
npm install
# 開発モードで起動
PORT=3001 npm run start:dev
* APIエンドポイント: http://localhost:3001/spots
3. フロントエンドの起動（Next.js）
さらに別のターミナルを開き、画面側を起動します。
Bash

cd frontend
# 依存パッケージのインストール（初回のみ）
npm install
# 開発モードで起動
npm run dev
* ブラウザ: http://localhost:3000

使用技術と選定理由
バックエンド
* NestJS: 構造化された設計により、保守性の高いAPI構築が可能なため。
* TypeORM: Entityベースでデータベース構造とコードを同期させるため。
* PostgreSQL + PostGIS: ST_DWithin 関数を利用し、データベース側で高速な半径検索（距離検索）を実現するため。
フロントエンド
* Next.js (App Router): Reactベースの最新フレームワークで、効率的な構成管理を行うため。
* Tailwind CSS: 直感的なスタイリングによりUI構築を高速化するため。
* Leaflet: 軽量かつOSSの地図ライブラリ。Google Maps API等に依存せず実装可能なため採用。

実装の工夫点
1. データの自動投入: docker compose up を実行するだけで、プログラムを通じて自動的にCSVがインポートされる仕組みを構築しました。
2. PostGISによる最適化: 距離計算をデータベース側（SQL）で行うことで、不要なデータ転送を減らし検索性能を向上させました。
3. API通信の安定化: CORSエラーやポート競合、SSR環境下でのLeafletの動作不良を解消し、安定した動作環境を実現しました。

今後の改善案
* 検索結果のキャッシュ化によるさらなる高速化
* 大量データ表示のためのマーカークラスタリング実装
* ユーザーのお気に入りスポット保存機能（認証機能）



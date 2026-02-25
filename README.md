# Landit Coding Test - 位置情報探索アプリ

## 概要

提供されたスポットCSVデータをデータベースへ自動インポートし、  
地図上で周辺スポットを探索できるWebアプリケーションです。

ユーザーは地図操作を行いながら以下を確認できます。

- 地図中心地点を基準とした半径検索
- スポットのマーカー表示
- 地図と連動したスポット一覧表示


## 環境構築

### 必要環境

- Docker
- Docker Compose
- Node.js（25.6.1）※ローカル実行時のみ


## 実行手順

```bash
git clone https://github.com/aya1119/landit-coding-test.git
cd landit-coding-test
docker compose up -d --build
```

起動されるサービス：

- PostgreSQL + PostGIS（Database）
- NestJS（Backend API）
- Next.js（Frontend）


以下へアクセスしてください。
```
http://localhost:3000
```

地図画面が表示されれば起動成功です。


## 使用した主要ライブラリとその選定理由

### Backend

#### NestJS
- モジュール構造による責務分離が容易
- 保守性・拡張性を考慮したAPI設計が可能

#### TypeORM
- EntityベースでDBスキーマをコード管理可能
- NestJSとの親和性が高いため採用

#### PostgreSQL + PostGIS
- 地理空間検索機能を標準で利用可能
- `ST_DWithin` による高速な距離検索を実現


### Frontend

#### Next.js（App Router）
- Reactベースで構造管理が容易
- Server / Client Component分離による拡張性確保

#### React Leaflet
- APIキー不要
- OSSベースで軽量な地図表示が可能

#### Tailwind CSS
- UI実装速度向上
- コンポーネント単位でスタイル管理可能


## 実装時に特に工夫した点、および技術的な判断

### Docker Composeによるワンコマンド起動

課題要件である

> docker compose up コマンド一つでアプリ一式が起動すること

を満たすため、以下を実装しました。

- DB / Backend / Frontend をDocker Composeで統合管理
- DB起動完了後にBackendが起動する `healthcheck` を設定
- `node_modules` をDocker Volumeで管理し環境差異を排除
- コンテナ間通信をサービス名ベースで接続
- API接続先を環境変数 (`NEXT_PUBLIC_API_BASE_URL`) により切替可能に設計

これにより **環境依存のない再現可能な実行環境** を実現しました。


## 時間が足りず簡略化した点・今後の改善

- マーカー大量表示時のクラスタリング未実装
- 認証機能・お気に入り保存機能未実装
- APIレスポンスキャッシュ最適化未対応
- 本番環境向けDocker multi-stage build未対応

今後はパフォーマンス改善を予定しています

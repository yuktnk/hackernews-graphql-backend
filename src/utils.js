const jwt = require("jsonwebtoken");
APP_SECRET = "GraphQL-is-aw3some"; // 本当はランダムな文字列にしておいた方がいい

// トークンを復号する関数
function getTokenPayload(token) {
    // トークン化されて物の前の情報（user.id）を復号
    return jwt.verify(token, APP_SECRET);
}

// ユーザ-IDを取得するための関数
function getUserId(req, authToken) {
    if (req) {
        // ヘッダーを確認 認証権限があるか
        const authHeader = req.headers.authorization;

        // 権限があるなら
        if (authHeader) {
            const token = authHeader.replace("Bearer", "");
            if (!token) {
                throw new Error("トークンが見つかりませんでした");
            }
            // トークンを復号する
            const { userId } = getTokenPayload(token);
            return userId;
        }
    } else if (authToken) {
        const { userId } = getTokenPayload(authToken);
        return userId;
    }

    throw new Error("認証権限がありません");
}

module.exports = {
    APP_SECRET,
    getUserId,
};

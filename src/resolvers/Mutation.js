const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { APP_SECRET } = require("../utils");

// ユーザーの新規登録のリゾルバ
async function signup(parent, args, context) {
    // パスワードの設定
    const password = await bcrypt.hash(args.password, 10);

    // ユーザーの新規作成
    const user = await context.prisma.user.create({
        data: {
            ...args,
            password,
        },
    });

    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
        user,
        token,
    };
}

// ユーザーログイン
async function login(parent, args, context) {
    const user = await context.prisma.user.findUnique({
        where: {
            email: args.email,
        },
    });
    if (!user) {
        throw new Error("メールアドレスもしくはパスワードが間違っています");
    }

    // パスワードの比較
    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) {
        throw new Error("メールアドレスもしくはパスワードが間違っています");
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
        token,
        user,
    };
}

// ニュースを投稿するリゾルバ
async function post(parent, args, context) {
    const { userId } = context;

    const newLink = await context.prisma.link.create({
        data: {
            url: args.url,
            description: args.description,
            postedBy: { connect: { id: userId } },
        },
    });

    // 送信する
    context.pubsub.publish("NEW_LINK", newLink);

    return newLink;
}

async function vote(parent, args, context) {
    const userId = context.userId;

    const vote = context.prisma.vote.findUnique({
        where: {
            linkId_userId: {
                linkId: Number(args.linkId),
                userId: userId,
            },
        },
    });

    // 2回投票を防ぐ
    if (Boolean(vote)) {
        throw new Error(`すでにその投稿には投票されています:${args.linkId}`);
    }

    // 投票する
    const newVote = context.prisma.vote.create({
        data: {
            user: { connect: { id: userId } },
            link: { connect: { id: Number(args.linkId) } },
        },
    });

    // 送信
    context.pubsub.publish("NEW_VOTE", newVote);

    return newVote;
}

module.exports = {
    signup,
    login,
    post,
    vote,
};

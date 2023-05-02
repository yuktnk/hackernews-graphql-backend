// 誰によって投稿されたのか？のリゾルバ

function postedBy(parent, args, context) {
    return context.prisma.link
        .findUnique({
            whre: { id: parent.id },
        })
        .postedBy();
}

module.exports = {
    postedBy,
};

function feed(parent, args, context) {
    return context.prisma.link.findMany();
}

modeule.exports = {
    feed,
};

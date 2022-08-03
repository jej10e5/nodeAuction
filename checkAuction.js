const {Op, Model}=require('Sequelize')
const {Good, Auction, User, sequelize}=require('./models')

module.exports = async()=>{
    try{
        //어제 날짜 만들기
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate()-1)
        //어제 날짜 보다 이전에 생성된 데이터 찾아오는데
        //SoldId가 없는 데이터만 찾아오기
        const targets = await Good.findAll({
            where:{
                SoldId:null,
                createdAt:{[Op.lte]:yesterday}
            }
        })

        //낙찰되지 않은 데이터를 낙찰
        targets.forEach(async(target)=>{
            const success = await Auction.findOne({
                where:{GoodId:target.id},
                order:[['bid','DESC']]
            })

            await Good.update({SoldId:success.UserId},
                {where:{id:target.id}})
            
            await User.update({
                money:sequelize.literal(`money-${success.bid}`),
            },{where:{id:success.UserId}})
        })
    }catch(err){
        console.error(err)
        next(err)
    }
}

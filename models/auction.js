const Sequelize = require('sequelize')
module.exports=class Auction extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            bid:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:0
            },
            msg:{
                type:Sequelize.STRING(100),
                allowNull:true
            }
        },{
            sequelize,
            timestamps:true, //생성,수정시간
            paranoid:true,  //삭제시간
            modelName:'Auction', //프로그램 내에서 사용할 이름
            tableName:'auctions', // 실제 테이블의 이름
            charset:'utf8',
            collate:'utf8_general_ci'
        })
    }
    static associate(db){
        db.Auction.belongsTo(db.User)
        db.Auction.belongsTo(db.Good)
    }
}
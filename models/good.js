const Sequelize = require('sequelize')
module.exports=class Good extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            name:{
                type:Sequelize.STRING(40),
                allowNull:false
            },
            img:{
                type:Sequelize.STRING(200),
                allowNull:true
            },
            price:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:0
            }
        },{
            sequelize,
            timestamps:true, //생성,수정시간
            paranoid:true,  //삭제시간
            modelName:'Good', //프로그램 내에서 사용할 이름
            tableName:'goods', // 실제 테이블의 이름
            charset:'utf8',
            collate:'utf8_general_ci'
        })
    }
    static associate(db){
        db.Good.belongsTo(db.User,{as:'Owner'})
        db.Good.belongsTo(db.User,{as:'Sold'})
        db.Good.hasMany(db.Auction)
    }
}
const Sequelize = require('sequelize')
module.exports=class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            email:{
                type:Sequelize.STRING(40),
                allowNull:false,
                unique:true
            },
            nick:{
                type:Sequelize.STRING(20),
                allowNull:false
            },
            password:{
                type:Sequelize.STRING(100),
                allowNull:true
            },
            money:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:0
            }
        },{
            sequelize,
            timestamps:true, //생성,수정시간
            paranoid:true,  //삭제시간
            modelName:'User', //프로그램 내에서 사용할 이름
            tableName:'users', // 실제 테이블의 이름
            charset:'utf8',
            collate:'utf8_general_ci'
        })
    }
    static associate(db){
        db.User.hasMany(db.Auction)
    }
}
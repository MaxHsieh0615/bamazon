var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:"baby22732864",
    database:"bamazon"
});

connection.connect(function(err){
    if (err) throw err;
    console.log("Good to go");
    makeTable();
});

var makeTable = function(){
    connection.query("select * from products", function(err,res){
        for (var i=0; i<res.length; i++){
            console.log(res[i].item_id + "|" + res[i].product_name + "|" + res[i].department_name + "|" + res[i].price + "|" + res[i].stock_quantity + "\n");
        }
    promptCustomer(res);   //question about res for tutor session, when should I put res in the ()
    })
}

var promptCustomer = function(res){
    inquirer.prompt([{
        type:"input",
        name:"choice",
        message:"What would you like to buy? [Quit with Q]"
    }]).then(function(answer){
        var correct = false;  //why do I want correct = false
        if(answer.choice.toUpperCase()=="Q"){
            process.exit();
        }
        for(var i=0;i<res.length;i++){
            if(res[i].product_name==answer.choice){
                correct=true;
                var product=answer.choice;
                var id=i;
                //validate function to validate if user input is number or not
                inquirer.prompt({
                    type:"input",
                    name:"quantity",
                    message:"How many would you like to buy?",
                    validate: function(value){
                        if(isNaN(value)==false){
                            return true;
                        } else {
                            return false;
                        }
                    }
                }).then(function(answer){
                    if((res[id].stock_quantity-answer.quantity)>0){
                        connection.query("UPDATE products SET stock_quantity='"+(res[id].stock_quantity-answer.quantity)+"' WHERE product_name='"+ product+"'", function(err,res2){
                            console.log("Product Bought!");
                            makeTable();
                        })
                    } else {
                        console.log("This item is already sold out!");
                        promptCustomer(res);
                    }
                })
            }
        }
        if(i==res.length && correct==false){
            console.log("We do not sell that here. Sorry!");
            promptCustomer(res);
        }
    })
}
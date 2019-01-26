var json2xls = require('json2xls');
var fs = require("fs");
var json_friends = JSON.parse(fs.readFileSync('AnastasiaFriends.json', 'utf8'));

//var arr = Object.keys(json_friends).map(function (key) { return json_friends[key]; });

//console.log(arr[0]);
//console.log(arr);

json_friends.response.map((user) => {
    if (user.city)
        user.city = user.city.title;
    if (user.country)
        user.country = user.country.title;
    if (user.occupation){
        if (user.occupation.name)
            user.occupation_name = user.occupation.name;
        if (user.occupation.type)
            user.occupation_type = user.occupation.type;    
            
        delete user.occupation;
    }
    
    if (user.personal){
        user = handlePersonal(user, 'political');
        user = handlePersonal(user, 'langs')
        user = handlePersonal(user, 'religion')
        user = handlePersonal(user, 'inspired_by')
        user = handlePersonal(user, 'people_main')
        user = handlePersonal(user, 'life_main')
        user = handlePersonal(user, 'political')
        user = handlePersonal(user, 'smoking')
        // if (user.personal.political)
        //     user.political = user.personal.political;
        // else
        //     user.political = "нет";
    } else {
        user.political = "нет";
        user.langs  = "нет";
        user.religion  = "нет";
        user.inspired_by  = "нет";
        user.people_main  = "нет";
        user.life_main  = "нет";
        user.smoking   = "нет";
        user.alcohol   = "нет";  
    }
    
    if (user.career && user.career[0]){
        user = handleCareer(user, 'company');
        user = handleCareer(user, 'country_id');
        user = handleCareer(user, 'city_id');
        user = handleCareer(user, 'from');
        user = handleCareer(user, 'until');
        user = handleCareer(user, 'position');
    } else {
        user.career_company = 'нет';
        user.career_country_id = 'нет';
        user.career_city_id = 'нет';
        user.career_from = 'нет';
        user.career_until = 'нет';
        user.career_position = 'нет';
    }
    delete user.personal;
    delete user.career;
    return user;
});
function handlePersonal(user, param){
    if (user.personal[param])
        user[param] = user.personal[param];
    else
        user[param] = "нет";
    return user;
}
function handleCareer(user, param){
    var newName = 'career_'+param;
    if (user.career[0][param])
        user[newName] = user.career[0][param];
    else
        user[newName] = "нет";
    return user;
}

var xls = json2xls(json_friends.response);

fs.writeFileSync('AnastasiaFriends.xlsx', xls, 'binary');

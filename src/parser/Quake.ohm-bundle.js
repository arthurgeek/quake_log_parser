'use strict';const {makeRecipe}=require('ohm-js');const result=makeRecipe(["grammar",{"source":"Quake {\n    // needed because space from built-in ohm rules consider \\n as space\n    space := \" \" | \"\\t\"\n\n    AllGames = Game (~end Game)*\n\t\n    Game = SeparatorToken? InitGameToken ActionTokens* ShutdownGameToken? SeparatorToken\n    \n    SeparatorToken = LinePrefix separator eol?\n    \n    InitGameToken = CommandToken<\"InitGame\">\n    ShutdownGameToken = CommandToken<\"ShutdownGame\">\n\t\n    ActionTokens = ClientUserInfoChangedToken\n                  | IgnoredCommandToken\n\t\n    ClientUserInfoChangedToken = LinePrefix \"ClientUserinfoChanged:\" userId \"n\\\\\" userName \"\\\\t\" rest\n    \n    CommandToken<command> = LinePrefix command \":\" rest\n    IgnoredCommandToken = LinePrefix (~commands letter)+ \":\" rest\n\n    // utils\n    LinePrefix = digit+ \":\" digit+\n    separator = \"------------------------------------------------------------\"\n    \n    userId = digit+\n    userName = (~\"\\\\t\" any)+\n\n    commands = separator\n             | \"InitGame\"\n             | \"ShutdownGame\"\n             | \"ClientUserinfoChanged\"\n\n    rest = (~eol any)* eol\n    eol = \"\\n\"\n}"},"Quake",null,"AllGames",{"space":["override",{"sourceInterval":[85,104]},null,[],["alt",{"sourceInterval":[94,104]},["terminal",{"sourceInterval":[94,97]}," "],["terminal",{"sourceInterval":[100,104]},"\t"]]],"AllGames":["define",{"sourceInterval":[110,138]},null,[],["seq",{"sourceInterval":[121,138]},["app",{"sourceInterval":[121,125]},"Game",[]],["star",{"sourceInterval":[126,138]},["seq",{"sourceInterval":[127,136]},["not",{"sourceInterval":[127,131]},["app",{"sourceInterval":[128,131]},"end",[]]],["app",{"sourceInterval":[132,136]},"Game",[]]]]]],"Game":["define",{"sourceInterval":[145,229]},null,[],["seq",{"sourceInterval":[152,229]},["opt",{"sourceInterval":[152,167]},["app",{"sourceInterval":[152,166]},"SeparatorToken",[]]],["app",{"sourceInterval":[168,181]},"InitGameToken",[]],["star",{"sourceInterval":[182,195]},["app",{"sourceInterval":[182,194]},"ActionTokens",[]]],["opt",{"sourceInterval":[196,214]},["app",{"sourceInterval":[196,213]},"ShutdownGameToken",[]]],["app",{"sourceInterval":[215,229]},"SeparatorToken",[]]]],"SeparatorToken":["define",{"sourceInterval":[239,281]},null,[],["seq",{"sourceInterval":[256,281]},["app",{"sourceInterval":[256,266]},"LinePrefix",[]],["app",{"sourceInterval":[267,276]},"separator",[]],["opt",{"sourceInterval":[277,281]},["app",{"sourceInterval":[277,280]},"eol",[]]]]],"InitGameToken":["define",{"sourceInterval":[291,331]},null,[],["app",{"sourceInterval":[307,331]},"CommandToken",[["terminal",{"sourceInterval":[320,330]},"InitGame"]]]],"ShutdownGameToken":["define",{"sourceInterval":[336,384]},null,[],["app",{"sourceInterval":[356,384]},"CommandToken",[["terminal",{"sourceInterval":[369,383]},"ShutdownGame"]]]],"ActionTokens":["define",{"sourceInterval":[391,472]},null,[],["alt",{"sourceInterval":[406,472]},["app",{"sourceInterval":[406,432]},"ClientUserInfoChangedToken",[]],["app",{"sourceInterval":[453,472]},"IgnoredCommandToken",[]]]],"ClientUserInfoChangedToken":["define",{"sourceInterval":[479,576]},null,[],["seq",{"sourceInterval":[508,576]},["app",{"sourceInterval":[508,518]},"LinePrefix",[]],["terminal",{"sourceInterval":[519,543]},"ClientUserinfoChanged:"],["app",{"sourceInterval":[544,550]},"userId",[]],["terminal",{"sourceInterval":[551,556]},"n\\"],["app",{"sourceInterval":[557,565]},"userName",[]],["terminal",{"sourceInterval":[566,571]},"\\t"],["app",{"sourceInterval":[572,576]},"rest",[]]]],"CommandToken":["define",{"sourceInterval":[586,637]},null,["command"],["seq",{"sourceInterval":[610,637]},["app",{"sourceInterval":[610,620]},"LinePrefix",[]],["param",{"sourceInterval":[621,628]},0],["terminal",{"sourceInterval":[629,632]},":"],["app",{"sourceInterval":[633,637]},"rest",[]]]],"IgnoredCommandToken":["define",{"sourceInterval":[642,703]},null,[],["seq",{"sourceInterval":[664,703]},["app",{"sourceInterval":[664,674]},"LinePrefix",[]],["plus",{"sourceInterval":[675,694]},["seq",{"sourceInterval":[676,692]},["not",{"sourceInterval":[676,685]},["app",{"sourceInterval":[677,685]},"commands",[]]],["app",{"sourceInterval":[686,692]},"letter",[]]]],["terminal",{"sourceInterval":[695,698]},":"],["app",{"sourceInterval":[699,703]},"rest",[]]]],"LinePrefix":["define",{"sourceInterval":[722,752]},null,[],["seq",{"sourceInterval":[735,752]},["plus",{"sourceInterval":[735,741]},["app",{"sourceInterval":[735,740]},"digit",[]]],["terminal",{"sourceInterval":[742,745]},":"],["plus",{"sourceInterval":[746,752]},["app",{"sourceInterval":[746,751]},"digit",[]]]]],"separator":["define",{"sourceInterval":[757,831]},null,[],["terminal",{"sourceInterval":[769,831]},"------------------------------------------------------------"]],"userId":["define",{"sourceInterval":[841,856]},null,[],["plus",{"sourceInterval":[850,856]},["app",{"sourceInterval":[850,855]},"digit",[]]]],"userName":["define",{"sourceInterval":[861,885]},null,[],["plus",{"sourceInterval":[872,885]},["seq",{"sourceInterval":[873,883]},["not",{"sourceInterval":[873,879]},["terminal",{"sourceInterval":[874,879]},"\\t"]],["app",{"sourceInterval":[880,883]},"any",[]]]]],"commands":["define",{"sourceInterval":[891,1006]},null,[],["alt",{"sourceInterval":[902,1006]},["app",{"sourceInterval":[902,911]},"separator",[]],["terminal",{"sourceInterval":[927,937]},"InitGame"],["terminal",{"sourceInterval":[953,967]},"ShutdownGame"],["terminal",{"sourceInterval":[983,1006]},"ClientUserinfoChanged"]]],"rest":["define",{"sourceInterval":[1012,1034]},null,[],["seq",{"sourceInterval":[1019,1034]},["star",{"sourceInterval":[1019,1030]},["seq",{"sourceInterval":[1020,1028]},["not",{"sourceInterval":[1020,1024]},["app",{"sourceInterval":[1021,1024]},"eol",[]]],["app",{"sourceInterval":[1025,1028]},"any",[]]]],["app",{"sourceInterval":[1031,1034]},"eol",[]]]],"eol":["define",{"sourceInterval":[1039,1049]},null,[],["terminal",{"sourceInterval":[1045,1049]},"\n"]]}]);module.exports=result;
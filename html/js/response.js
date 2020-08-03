var loc_arr = { "userId":{ "de":"Benutzer-ID", "en":"User-ID", "es":"Usuario-ID"},
                "characterId":{ "de":"Charakter-ID", "en":"Character-ID" }, 
                "resourceId":{ "de":"Ressourcen-ID", "en":"Resource-ID" },
                "orgId":{ "de":"Unternehmens-ID", "en":"Company-ID" },
                "cityId":{ "de":"Stadt-ID", "en":"City-ID" },
                "storageId":{ "de":"Lager-ID", "en":"Storage-ID" },
                "inventoryId":{ "de":"Inventar-ID", "en":"Inventory-ID" },
                "orgName":{ "de":"Unternehmensname", "en":"Company-Name" },
                "username":{ "de":"Benutzername", "en":"Username" },
                "password":{ "de":"Neues Passwort", "en":"New Password" },
                "re_pass":{ "de":"Neues Passwort wiederholen", "en":"Repeat New Password" },
                "full_name":{ "de":"Echter Name", "en":"Real Name" },
                "dm":{ "de":"Dungeon Master", "en":"Dungeon Master" },
                "language":{ "de":"Sprache", "en":"Language" },
                "definition":{ "de":"Definition", "en":"Definition" },
                "name":{ "de":"Name", "en":"Name" },
                "weight":{ "de":"Gewicht", "en":"Weight" },
                "population":{ "de":"Einwohnerzahl", "en":"Population" }, 
                "tax":{ "de":"Steuer", "en":"Tax" }, 
                "copper":{ "de":"Kupfer", "en":"Copper" },
                "silver":{ "de":"Silber", "en":"Silver" },
                "gold":{ "de":"Gold", "en":"Gold" },
                "cp_value":{ "de":"Kupferwert", "en":"Copper-Value" },
                "amount":{ "de":"Anzahl", "en":"Amount" },
                "count":{ "de":"Anzahl", "en":"Count" },
                "Benutzerdaten bearbeiten":{ "de":"Benutzerdaten bearbeiten", "en":"Edit User-Data"},
                "Neues Passwort anlegen":{ "de":"Neues Passwort anlegen", "en":"Set New Password"},
                "Hier kann ein neues Passwort für den aktuellen Nutzer gesetzt werden.":{ "de":"Hier kann ein neues Passwort für den aktuellen Nutzer gesetzt werden.", "en":"Here you can change the password for the current user."},
                "Es muss mindestens ein Gro&szlig;- und Kleinbuchstabe angegeben werden. Au&szlig;erdem muss das Passwort mindestens 8 Zeichen lang sein":{ "de":"Es muss mindestens ein Gro&szlig;- und Kleinbuchstabe angegeben werden. Au&szlig;erdem muss das Passwort mindestens 8 Zeichen lang sein", "en":"You must put atleast one Uppercase and lowercase character. You have to put atleast 8 characters"} };

function handle_response(r, tab, msg = ""){
    if(r){
        var response = JSON.parse(r);
        if(tab == "user"){
            var content = msg+"<div class='row'><div class='col-12'>";
            var lang = $('.hidden span.language').text();
            if(lang == "en"){
                content += "<h2>Edit User Data</h2><h4>Welcome, <span class='full_name'></span>!</h4><p>Here you can change your account credentials.</p></div>";
            } else if(lang == "de"){
                content += "<h2>Benutzerdaten bearbeiten</h2><h4>Willkommen, <span class='full_name'></span>!</h4><p>Hier k&ouml;nnen die Nutzerdaten ver&auml;ndert werden.</p></div>";
            } else{
                content += "<p></p></div>";
            }
            var i = 0;
            var hidden_id;
            while(i<response.content.length){
                var obj = response.content[i];
                for(x in obj){
                    var loc_x = x;
                    if(loc_arr[x]){ loc_x = loc_arr[x][lang]; }
                    var value = obj[x];
                    var is_pri = false;
                    var is_sec = false;
                    if(response.primary.length){ if(response.primary[0].Column_name == x){ is_pri = true; } }
                    if(response.secondary.length){ 
                        count = 0;
                        while(count<response.secondary.length){
                            if(response.secondary[count].Column_name == x){ is_sec = true; count = response.secondary.length;} 
                            count++;
                        }
                    }
                    if(is_pri){
                        hidden_id = "<input type='hidden' data-name='"+x+"' value='"+value+"' />";
                        content += "<div class='col-6'><label for='"+x+"'>"+loc_x+"</label><input type='text' class='form-control pri is_pri disabled' data-tab='"+tab+"' data-name='"+x+"' data-title='"+loc_x+": "+value+"' title='"+loc_x+": "+value+"' value='"+value+"' /></div>";
                        content += "<div class='col-12'><hr/></div>";
                    } else if(is_sec){
                        content += "<div class='col-6'><label for='"+x+"'>"+loc_x+"</label><input type='text' class='form-control pri is_sec' data-tab='"+tab+"' data-name='"+x+"' data-title='"+loc_x+": "+value+"' title='"+loc_x+": "+value+"' value='"+value+"' /></div>";
                    } else{
                        if(x != "hashed_pw"){
                            if(x != "dm"){
                                content += "<div class='col-6'><label for='"+x+"'>"+loc_x+"</label><input type='text' class='form-control' data-tab='"+tab+"' data-name='"+x+"' data-title='"+loc_x+": "+value+"' title='"+loc_x+": "+value+"' value='"+value+"' /></div>";
                            }
                        }
                    }
                }
                i++;
            }
            content += "<div class='col-12'><hr/></div>";
            if(lang == "en"){
                ne_pw = "The entered password does not match the previously entered password.";
            } else if(lang == "de"){
                ne_pw = "Das eingegebene Passwort stimmt nicht mit dem vorherigen &uuml;berein.";
            }
            var loc_x = 'password';
            var loc_title = 'Es muss mindestens ein Gro&szlig;- und Kleinbuchstabe angegeben werden. Au&szlig;erdem muss das Passwort mindestens 8 Zeichen lang sein';
            if(loc_arr[loc_title]){ loc_title = loc_arr[loc_title][lang]; }
            if(loc_arr[loc_x]){ loc_x = loc_arr[loc_x][lang]; }
            loc_y = 'Neues Passwort anlegen';
            if(loc_arr[loc_y]){ loc_y = loc_arr[loc_y][lang]; }
            var loc_z = 'Hier kann ein neues Passwort für den aktuellen Nutzer gesetzt werden.';
            if(loc_arr[loc_z]){ loc_z = loc_arr[loc_z][lang]; }
            content += "<form class='col-12' id='new_password_form' action='php/set_password.php' method='post'><div class='row'>"+hidden_id+"<div class='col-12'><h4>"+loc_y+"</h4><p>"+loc_z+"</p><hr/></div><div class='col-6'><label for='password'>"+loc_x+"</label><input type='password' class='form-control' data-tab='"+tab+"' data-name='password' data-title='"+loc_x+"' title='"+loc_title+"' minlength='8' pattern='(?=.*[a-z])(?=.*[A-Z]).{8,}' required /></div>";
            loc_x = 're_pass';
            if(loc_arr[loc_x]){ loc_x = loc_arr[loc_x][lang]; }

            content += "<div class='col-6'><label for='password'>"+loc_x+"</label><input type='password' class='form-control' data-tab='"+tab+"' data-name='re_pass' data-title='"+loc_x+"' title='"+loc_title+"' minlength='8' pattern='(?=.*[a-z])(?=.*[A-Z]).{8,}' required /></div>";
            content += "<div class='ml-auto col-6 repass_ne_pass hidden'><div class='alert alert-danger' role='alert'>"+ne_pw+"</div></div>"
            content += "<div class='col-12' style='position:relative;'><hr/><button type='submit' class='btn btn-primary'>Submit</button><a class='btn btn-secondary' href='index.html?aktion=logout' style='position: absolute;right: 15px;'>Logout <i class='fas fa-sign-out-alt' aria-hidden='true'></i></a></div></div></form></div>";
        } else{
            if(response.content.length){
                var content = "<table class='table table-striped table-bordered' data-page-length='25' width=''>";
                var form = "<div class='row'><div class='col-12'><form class='popup-form' data-tab='"+tab+"' method='post'><div class='form-group col-12'><h4 class='header'>Datensatz anlegen für Tabelle '"+tab+"'</h4><div class='row'>";
                var alt_text = tab+" mit ID '<span class='titleId'></span>' bearbeiten";
                var i = 0;
                while(i<response.content.length){
                    var obj = response.content[i];
                    if(i===0){
                        content += "<thead>";
                        for(x in obj){
                            var loc_x = x;
                            if(loc_arr[x]){
                                loc_x = loc_arr[x][$('.hidden span.language').text()];
                            }
                            content += "<th>";
                            content += loc_x;
                            content += "</th>";
                        }
                        content += "</thead>";
                        content += "<tbody>";
                    }
                    content += "<tr>";
                    for(x in obj){
                        var loc_x = x;
                        if(loc_arr[x]){
                            loc_x = loc_arr[x][$('.hidden span.language').text()];
                        }
                        var value = obj[x];
                        var is_pri = false;
                        var is_sec = false;
                        if(response.primary.length){ if(response.primary[0].Column_name == x){ is_pri = true; } }
                        if(response.secondary.length){ 
                            count = 0;
                            while(count<response.secondary.length){
                                if(response.secondary[count].Column_name == x){ is_sec = true; count = response.secondary.length;} 
                                count++;
                            }
                        }
                        if(i == 0){
                            if(is_pri){
                                form += "<div class='col-6'><label for='"+x+"'>"+loc_x+"</label><input type='text' class='form-control is_pri disabled' id='"+x+"'></div>";
                            } else if(is_sec){
                                form += "<div class='col-6'><label for='"+x+"'>"+loc_x+"</label><input type='text' class='form-control is_sec' id='"+x+"'></div>";
                            } else{
                                form += "<div class='col-6'><label for='"+x+"'>"+loc_x+"</label><input type='text' class='form-control' id='"+x+"'></div>";
                            }
                        }
                        content += "<td>";
                        if(is_pri){
                            content += "<div class='tab-val pri' data-title='"+loc_x+": "+value+"' title='"+loc_x+": "+value+"'>"+value+"</div><input type='text' class='hidden tab-val pri is_pri' data-tab='"+tab+"' data-name='"+x+"' data-title='"+loc_x+": "+value+"' title='"+loc_x+": "+value+"' value='"+value+"' />";
                        } else if(is_sec){
                            content += "<div class='tab-val sec' data-title='"+loc_x+": "+value+"' title='"+loc_x+": "+value+"'>"+value+"</div><input type='text' class='hidden tab-val is_sec' data-tab='"+tab+"' data-name='"+x+"' data-title='"+loc_x+": "+value+"' title='"+loc_x+": "+value+"' value='"+value+"' />";
                        }else{ 
                            content += "<div class='tab-val' data-title='"+loc_x+": "+value+"' title='"+loc_x+": "+value+"'>"+value+"</div><input type='text' class='hidden tab-val' data-tab='"+tab+"' data-name='"+x+"' data-title='"+loc_x+": "+value+"' title='"+loc_x+": "+value+"' value='"+value+"' />";
                        }
                        content += "</td>";
                    }
                    content += "</tr>";
                    i++;
                }
                form += "</div><div class='footer'><button type='submit' class='btn btn-primary'>Submit</button></div></div></form></div></div>";
                content += "</tbody></table>";
            } else{
                content = "<h4 class='text-danger'>Es wurden keine Daten f&uuml;r die Tabelle: '"+tab+"' gefunden!</h4>";
            }
        }
    } else{
        content = "<h4 class='text-danger'>Es wurden keine Daten f&uuml;r die Tabelle: '"+tab+"' gefunden!</h4>";
    }
    if(tab == "user"){
        $('.resp-container').addClass('overflowx-h');
    } else{
        $('.resp-container').removeClass('overflowx-h');
    }
    $('.resp-container').empty().append(content);
    $('span.full_name').text($('input[data-name=full_name]').val());
    $('.popup-insert').empty();
    $('.popup-insert').append(form);
    $('.popup-insert form').addClass('insert-form');
    $('.popup-update').empty();
    $('.popup-update').append(form);
    $('.popup-update form').addClass('update-form');
    var i = 0;
    var selector = $('.update-form input');
    while(i<selector.length){
        selector[i].id = selector[i].id+".2";
        i++;
    }
    $('.popup-update form h4').html(alt_text);
    $('.load-dialog').hide();
    $('.toolbar').addClass('show');
    $('.resp-container table').DataTable({ paging: true });
    bindEventAll(tab);
}
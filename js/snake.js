let start_game = false;
document.getElementById('start_game').addEventListener("click",
    function(){
        if( start_game ) {
            alert('Pause');
            return;
        }  
        let game = new snake( 12, 16 );
        game.show_field(); 
        game.go();
        
        document.addEventListener('keydown', function(event) {
            switch( event.code ) {
                case 'ArrowUp' : game.snake[0]['move'] == 'down' ? game.reverse_move() : game.snake[0]['move'] = 'up'; break;
                case 'ArrowDown' : game.snake[0]['move'] == 'up' ? game.reverse_move() : game.snake[0]['move'] = 'down'; break;
                case 'ArrowLeft' : game.snake[0]['move'] == 'right' ? game.reverse_move() : game.snake[0]['move'] = 'left'; break;
                case 'ArrowRight' : game.snake[0]['move'] == 'left' ? game.reverse_move() : game.snake[0]['move'] = 'right'; break;
            }    
        });
        document.getElementById('up').addEventListener("click", function(event) { game.snake[0]['move'] == 'down' ? game.reverse_move() : game.snake[0]['move'] = 'up'; });
        document.getElementById('down').addEventListener("click", function(event) { game.snake[0]['move'] == 'up' ? game.reverse_move() : game.snake[0]['move'] = 'down'; });
        document.getElementById('left').addEventListener("click", function(event) { game.snake[0]['move'] == 'right' ? game.reverse_move() : game.snake[0]['move'] = 'left'; });
        document.getElementById('right').addEventListener("click", function(event) { game.snake[0]['move'] == 'left' ? game.reverse_move() : game.snake[0]['move'] = 'right'; });
} );

class snake
{
    constructor( width, height) {
        this.height = height;
        this.width = width;
        this.point = 0;
        this.speed = 1000;
        this.mas_field = this.make_mas_field();
        this.snake = this.make_snake();
        this.snake_new_elem = this.make_snake_new_elem();
    }

    go()
    {   
        start_game = true;
        let game = this;
        if( this.check_add_new_elem() )
        {
            this.add_snake_new_elem();
            this.snake_new_elem = this.make_snake_new_elem();
            this.change_parameters();
        } else {
            this.move_snake();
            this.forward_move();
        }
       
        if( this.game_over() ) {
            alert('Game over');
            start_game = false;
            return;
        } 
        this.show_snake();
        setTimeout(function(){game.go();}, game.speed );
    }

    reverse_move() 
    {   
        this.snake.reverse();
        this.forward_move();
        for( let i = 0; i < this.snake.length; i++ ) {
            switch( this.snake[i]['move'] ) {
                case 'up' : this.snake[i]['move'] = 'down'; break;
                case 'down' : this.snake[i]['move'] = 'up'; break;
                case 'left' : this.snake[i]['move'] = 'right'; break;
                case 'right' : this.snake[i]['move'] = 'left'; break;
            } 
        }
    }

    forward_move( move=false )
    {
        for( let i = this.snake.length - 1; i > 0; i-- ) {
            this.snake[i]['move'] = this.snake[i - 1]['move'];
        }
        this.snake[0]['move'] = move ? move : this.snake[0]['move'];
    }

    change_parameters()
    {
        this.point += 100;
        if( this.point % 100 == 0) { 
            this.speed = this.speed - 100 > 100 ? this.speed - 100 : 100;
        }    
        document.getElementById('point_field').value = this.point;
        document.getElementById('speed_field').value = 10 - this.speed / 100;
    }

    game_over()
    {
        if(  this.snake[0]['x'] < 0  ||  this.snake[0]['x'] > this.width - 1 || 
              this.snake[0]['y'] < 0  || this.snake[0]['y'] > this.height - 1 )  {
                  console.log("out field "+this.snake[0]['x']+" "+this.snake[0]['y']);
            return true;
        }
        for( let i = 3; i < this.snake.length; i++ ) {
           if( this.snake[i]['x'] == this.snake[0]['x'] && this.snake[i]['y'] == this.snake[0]['y'] ) {
               console.log("element snake "+this.snake[0]['x']+" "+this.snake[0]['y']);
               console.log(this.snake);
               return true;
           }      
        }
        return false;
    }

    move_snake()
    {
        for( let i = 0; i < this.snake.length; i++ ) {
            switch( this.snake[i]['move'] ) {
                case 'up' : this.snake[i]['y']--; break;
                case 'down' : this.snake[i]['y']++; break;
                case 'left' : this.snake[i]['x']--; break;
                case 'right' : this.snake[i]['x']++; break;
            }
        }
    }

    make_mas_field()
    {
        let mas = [];
        for( let i = 0; i < this.height; i++ ) {
            mas[i] = [];
            for( let j = 0; j < this.width; j++ ) {
                mas[i][j] = 0;
            }
        }
        return mas;
    }

    make_snake()
    {
        return [
            { x: this.width / 2, y: this.height / 2, move : 'left' },
            { x: this.width / 2 + 1, y: this.height / 2 , move : 'left' },
            { x: this.width / 2 + 2, y: this.height / 2 , move : 'left' },
            { x: this.width / 2 + 3, y: this.height / 2 , move : 'left' },
        ];
    }

    make_snake_new_elem()
    {
        let mas = [];
        for( let i = 0; i < this.width; i++ ) {
            for( let j = 0; j < this.height; j++ ) {
                if ( !this.is_snake_elem( i, j ) ) {
                    mas.push([ { x: i, y: j, move: ''} ] );   
                }
            }
        } 
        let rand = this.randomInteger(0, mas.length - 1);
        return mas[rand]; 
    }

    check_add_new_elem()
    {
        let x = this.snake[0]['x'];
        let y = this.snake[0]['y']; 
        switch( this.snake[0]['move'] ) {
            case 'up' : y--; break;
            case 'down' : y++; break;
            case 'left' : x--; break;
            case 'right' : x++; break; 
        }
        return  x == this.snake_new_elem[0]['x'] && y == this.snake_new_elem[0]['y'] ? true : false;
    }

    add_snake_new_elem()
    {
        this.snake_new_elem[0]['move'] = this.snake[0]['move'];
        this.snake.unshift(this.snake_new_elem[0]);
    }

    randomInteger(min, max) 
    {
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }

    show_snake()
    {
        let table = document.getElementById('game_field'); 
        if( !table ) {
            return false;
        }
        let tr = table.querySelectorAll('tr');
        for( let i = 0; i < tr.length; i++ )
        {
            let td = tr[i].querySelectorAll('td');
            for( let j = 0; j < td.length; j++ ) {
                if( this.is_snake_elem( j, i ) ) {
                    td[j].setAttribute('class', 'field_snake');
                } else if( this.is_snake_new_elem( j, i ) ) {
                    td[j].setAttribute('class', 'field_new_snake');
                } else {
                    td[j].setAttribute('class', 'field_empty');
                }
            }
        } 
    }

    is_snake_elem( x, y )
    {
        for( let i = 0; i < this.snake.length; i++ )
        {
            if( this.snake[i]['x'] == x && this.snake[i]['y'] == y ) {
                return true;
            }
        }
        return false;
    }

    is_snake_new_elem( x, y )
    {
        return this.snake_new_elem[0]['x'] == x && this.snake_new_elem[0]['y'] == y ? true : false;
    }

    show_field()
    {
        let game_place = document.getElementById('game');
        if( game_place ) {
            let table = this.create_table();
            let information_panel = this.create_information_panel();
            game_place.innerHTML = table + information_panel;
        } 
    }

    create_table()
    {
        let table = '<div><table id="game_field">';
        for( let i = 0; i < this.mas_field.length; i++ ) {
            table += '<tr>';
            for( let j = 0; j < this.mas_field[i].length; j++ ) {
               table += '<td class="field_empty"></td>';
            }
            table += '</tr>';
        }
        return table + '</table></div>';
    }
    create_information_panel() 
    {
       return '<div id="information_panel">'+
       '<div class="point">Points <input id="point_field" class="field" type="text" value="'+this.point+'" /></div>'+
       '<div class="speed">Speed <input id="speed_field" class="field" type="text" value="'+(10 - this.speed / 100)+'" /></div>'+
       '<div><button id="up" style="margin-left:50px;">Up</button></div>'+
       '<div"><button id="left">Left</button>'+
       '<button id="right">Right</button></div>'+
       '<div ><button id="down" style="margin-left:50px;">Down</button></div>'+
       '</div><br/><br/>'; 
    }
}
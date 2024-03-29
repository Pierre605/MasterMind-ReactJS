import React from 'react';
import './App.css';
import Stars from './ShootingStars';
import './ShootingStars.scss';


const colors = ['🔵', '🔴', '🟢', '🟡', '🟣'];
let app_gh_pages_URL = "https://pierre605.github.io/MasterMind-ReactJS/";


class App extends React.Component {
    state = {
        table: [],
        combi_to_find: [],
        combi_proposal: [],
        combi_check: [],
        win_serie: 0
    }


    componentDidMount() {
        this.setState({
            combi_to_find: this.GenerateCombi(),
            table: this.GenerateTable(),
            combi_check: this.GenerateCheckTable(),
        });
        this.ColorSelect();
        setTimeout(() => {this.GridRowsBorderAdjustment()}, 2)
    }

    GenerateTable() {
        let table = []
        for (let i=0; i < 6; i++) {
            table.push([null, null, null, null])
        }
        return table
    }

    GenerateCheckTable() {
        let table = []
        for (let i=0; i < 6; i++) {
            table.push([[null, null], [null, null]])
        }
        return table
    }

    GridRowsBorderAdjustment = () => {
        let rows_p = document.getElementsByClassName('row-p');
        let rows_c = document.getElementsByClassName('row-c');

        for (var i=0; i < rows_p.length; i++) {
            if (i !== rows_p.length-1) {
                rows_p[i].style.borderBottom = '1px solid white';
                rows_c[i].style.borderBottom = '1px solid white';
            }
        }
    }


    GenerateCombi = () => {
        let n = 0;
        let random_list = []
        let combi = []
        while (n < 50) {
            let r = Math.floor(Math.random() * colors.length);
            n ++;
            if (!(random_list.includes(r))) {
                random_list.push(r)
            }
        }
        random_list = random_list.slice(0, 4)
        for (const i of random_list) {
            combi.push(colors[i])
        }
        // console.log("combi:", combi)
        return combi
    }

    ColorSelect = () => {
        let colors = document.getElementsByClassName('color-set')
        for (const color of colors) {
            color.addEventListener('click', () => {this.CombiProposal(color.id)})
        }
    }
    
    CombiProposal = (color) => {
        console.log("color select:", color);
        let combi_proposal = this.state.combi_proposal;

        if ((!(combi_proposal.includes(color))) && (combi_proposal.length < 4)) {
            combi_proposal.push(color)
        }

        let stars = document.getElementsByClassName('stars')
            stars[0].style.display = 'none'

        this.setState({combi_proposal: combi_proposal})
    }


    CombiProposalClear = () => {
        let combi_proposal_cleared = []
        this.setState({
            combi_proposal: combi_proposal_cleared
        })
    }

    EndGameModal(text) {
            
        let modal = document.getElementById("Modal-end");
        modal.style.display = "block";

        let end_text = document.getElementById('text-end')
        end_text.innerHTML = text

        let span = document.getElementsByClassName("close")[0];
        
        span.onclick = (event) => {
        modal.style.display = "none";
        setTimeout(() => {
            this.setState({
                combi_to_find: this.GenerateCombi(),
                table: this.GenerateTable(),
                combi_check: this.GenerateCheckTable(),
                })
        }, 10)};


        window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
            setTimeout(() => {
                this.setState({
                    combi_to_find: this.GenerateCombi(),
                    table: this.GenerateTable(),
                    combi_check: this.GenerateCheckTable(),
                    })
            }, 10)};
            }
        }
    
    WinSerieAnimation() {
        let win_serie = this.state.win_serie
        let stars = document.getElementsByClassName('stars');

        if ((win_serie >= 2) && (win_serie < 5)){
            stars[0].style.display = 'block';
        }

        else if (win_serie >= 5) {
            stars[0].style.display = 'block';
            for (let i=0; i < stars[0].childNodes.length; i++) {
                stars[0].childNodes[i].style.color = 'gold'
            }
        }
    }

    


    CombiCheck = () => {
        let combi = this.state.combi_proposal;
        let combi_to_find = this.state.combi_to_find;
        let table = this.state.table;
        let combi_check = this.state.combi_check;
        let win_serie = this.state.win_serie;
        let check = [];
        let shaken = [];
        let random_list = [];
        let n = 0;
        const combi_to_find_to_print = (combi_to_find).join(' ')
        const loose_text = `<b>Perdu</b> <br><br>La combinaison à trouver était:<br/>${combi_to_find_to_print}`

        if (combi.length === 4) {
            
            for (let i=0; i < combi.length; i++) {
                if (combi.indexOf(combi[i]) === combi_to_find.indexOf(combi[i])) {
                    check.push('⚫')
                }
                else if (combi_to_find.includes(combi[i])) {
                    check.push('⚪')
                }
                else {
                    check.push('❌')
                }
            }

            // Win Check
            let count = 0;
            for (const color of check) {
                if (color === '⚫') {
                    count += 1
                }
            }
            if (count === 4) {
                console.log("WIN")
                this.setState({ win_serie: win_serie += 1 });
                let win_text = ''
                setTimeout(() => {win_text = `<b>Gagné ! Bien joué</b> <br>La combinaison à trouver était bien:<br/>${combi_to_find_to_print}<br>Série de victoires actuelle : <b>${this.state.win_serie}</b>`}, 150)
                
                setTimeout(() => {this.EndGameModal(win_text)}, 200)

                setTimeout(() => {this.WinSerieAnimation()}, 200)
            }


            // Randomize check result order
            while (n < 50) {
                let r = Math.floor(Math.random() * check.length)
                n++;
                if (!(random_list.includes(r))) {
                    random_list.push(r)
                }
            }
            random_list = random_list.slice(0, 4)

            for (const indx of random_list) {
                shaken.push(check[indx])
            }

            let shaken_1 = shaken.slice(0, 2)
            let shaken_2 = shaken.slice(2, 4)
            
            shaken = [shaken_1, shaken_2]
            console.log("shaken check:", shaken)
            
            
            // Fill play table
            table = table.reverse()
            for (let i=0; i < table.length; i++) {
                if ((table[i]).includes(null)) {
                    table[i] = []
                    table[i] = combi
                    break
                }
            }
            
            table = table.reverse()

            // Fill check table
            let arr2 = ['⚫']
            combi_check = combi_check.reverse()
            for (let i=0; i < combi_check.length; i++) {
                if ((combi_check[i][0].includes(null)) && (i !== combi_check.length - 1)) {
                    combi_check[i] = shaken
                    break
                    }

                if (i === combi_check.length - 1) {
                    console.log("last row")
                    let isFounded_1 = shaken[0].every( ai => arr2.includes(ai) );
                    let isFounded_2 = shaken[1].every( ai => arr2.includes(ai) );
                    if ((isFounded_1 === false) || (isFounded_2 === false)) {
                        combi_check[i] = shaken
                        console.log("YOU LOOSE")
                        this.setState({ win_serie: 0 })
                        setTimeout(() => {this.EndGameModal(loose_text)}, 150)
                        break
                    }
                    else if ((isFounded_1 === true) && (isFounded_1 === true)) {
                        combi_check[i] = shaken
                        break
                    }
                }  
            }
            console.log("combi check:", combi_check)
            combi_check = combi_check.reverse()


            this.setState({
                table: table,
                combi_check: combi_check,
                combi_proposal: []
            })
        }
    }

    DisplayRulesModal() {
        console.log('hello')
        let modal = document.getElementById("Modal-rules");
        modal.style.display = "block";

        let span = document.getElementsByClassName("close")[0]; 
        span.onclick = (event) => {
        modal.style.display = "none";
        }

        window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
            }
        }
    }





    render() {

    return (
    <div id='main'>
        <Stars />
        <h2>MASTER MIND</h2>
        <img alt='info icon' onClick={() => this.DisplayRulesModal()} id='info-icon' src='https://pierre605.github.io/MasterMind-ReactJS/info.png'></img>
        <div id='text'>
            <i>"2 victoires d'affilée et c'est une pluie d'étoiles d'argent,<br/>5 victoires et vous serez couvert d'or 💫"</i>
        </div>
        <div id="Modal-rules">
            <div id="modal-rules-content">
                <span class="close"></span>
                <p id="text-rules">Règles du jeu 📜<br/><br/>Vous devez trouver parmi 5 couleurs possibles une combinaison de 4 couleurs dans le bon ordre. Une fois votre proposition de combinaison jouée, le jeu vous indique par une croix rouge qu'il vous manque une couleur, par un point blanc que vous avez la bonne couleur mais pas à la bonne place et par un point noir que vous avez la bonne couleur à la bonne place, sachant que l'ordre d'affichage de ces indices est aléatoire.</p>
            </div>
        </div>
        <div className='aside'>
            <div className='grid-p'>
                {this.state.table.map((row, i) => {
                    return (
                        <div className='row-p' key={i}>{row}</div>
                    )
                })}
            </div>
            <div id="Modal-end">
                <div id="modal-end-content">
                    <span className="close"></span>
                    <p id="text-end"></p>
                </div>
            </div>
            <div className='grid-c'>
                {this.state.combi_check.map((row, i) => {
                    return (
                    <div className='row-c' key={i}>
                    {row.map((pair, j) => {
                        return (
                            <div key={j}>{pair}</div>
                        )
                    })}
                    </div>
                    )
                })}
            </div>
        </div>

        <div className='wrapper-set'>
            {colors.map((color, i) => {
                return (
                    <div key={i} className='color-set' id={color}>{color}</div>
                )
            })}
        </div>

        <div>Votre combinaison</div>
        <div className='wrapper-combi'>
            {this.state.combi_proposal.map((color, i) => {
                return (
                    <div key={i}>{color}</div>
                )
            })}
        </div>

        <div className="bouton">
            <button type="button" onClick={() => {this.CombiProposalClear()}} className="btn btn-light btn-sm">Clear</button>
            <button type="button" onClick={() => {this.CombiCheck()}} className="btn btn-primary btn-sm">Jouer</button>
        </div>
            
    </div>
    );
    }
}

export default App;

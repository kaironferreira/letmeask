
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { Link, useHistory } from 'react-router-dom';
import '../styles/auth.scss';
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';


export function NewRoom (){
    const [newRoom, setNewRoom] = useState('');

    const history = useHistory();

     const {user} = useAuth();
    
    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();
        if(newRoom.trim() === ''){
            return;
        }

        const roomRef = database.ref('rooms');

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,
        });

        history.push(`/rooms/${firebaseRoom.key}`);



    }

    return(
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                   <h2> Criar uma sala </h2>
                    <form onClick={handleCreateRoom}>
                        <input type="text" placeholder="Nome da sala" value={newRoom} onChange={event => setNewRoom(event.target.value)} />
                        <Button type="submit">Criar sala</Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}
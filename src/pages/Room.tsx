import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import {Button} from '../components/Button';
import {RoomCode} from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import '../styles/room.scss';

type FirebaseQuestions = Record<string, {
    author: {
        name: string,
        avatar: string
    }
    content: string,
    isAnswerd: boolean,
    isHighlighted: boolean
}>


type Question = {
    id: string,
    author: {
        name: string,
        avatar: string
    }
    content: string,
    isAnswerd: boolean,
    isHighlighted: boolean,
}

type RoomParams = {
    id: string;
}

export function Room (){
    const {user} = useAuth();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('');


    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.once('value', room => {
            const databaseRom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRom.questions ?? {};
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key,value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswerd: value.isAnswerd,
                }
            });

            setTitle(databaseRom.title);
            setQuestions(parsedQuestions);
        })

    }, [roomId]);




    async function handleSendQuestion(event: FormEvent){
        event.preventDefault();

        if(newQuestion.trim() === ''){
            return;
        }

        if(!user){
            throw new Error ('You must be logged in');
        }

        const question = {
            content:newQuestion,
            author: {
               name: user.name, 
               avatar: user.avatar,
            },
            isHighlighted: false,
            isAnswerd: false
        };

        await database.ref(`rooms/${roomId}/questions`).push(question);

        setNewQuestion('');

    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="letmeask" />
                    <RoomCode code={roomId}/>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>{title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea placeholder="O que você deseja perguntar?" value={newQuestion} onChange={event => setNewQuestion(event.target.value)}/>
                    <div className="form-footer">
                        { user ? (
                        <div className="user-info">
                            <img src={user.avatar} alt={user.name}/>
                            <span>{user.name}</span>
                        </div>
                        ) : (
                            <span>Para enviar uma perguntar, <button>faça seu login</button>.</span>
                        ) }
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>

            </main>
        </div>
    );
}
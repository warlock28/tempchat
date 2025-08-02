import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GameCard = ({ 
  game,
  onLaunch,
  isActive = false,
  className = ""
}) => {
  return (
    <div className={`
      bg-card border border-border rounded-lg p-4 transition-all spring-bounce cursor-pointer
      ${isActive ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}
      ${className}
    `}>
      <div className="flex items-center space-x-3 mb-3">
        <div className={`
          w-10 h-10 rounded-lg flex items-center justify-center
          ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'}
        `}>
          <Icon name={game?.icon} size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-foreground truncate">
            {game?.name}
          </h4>
          <p className="text-xs text-muted-foreground">
            {game?.players} player{game?.players !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
        {game?.description}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Clock" size={12} />
          <span>{game?.duration}</span>
        </div>
        
        <Button
          variant={isActive ? "default" : "outline"}
          size="sm"
          onClick={() => onLaunch(game)}
          className="spring-bounce"
        >
          {isActive ? 'Playing' : 'Play'}
        </Button>
      </div>
    </div>
  );
};

const TriviaGame = ({ 
  onAnswer = () => {},
  onNext = () => {},
  currentQuestion = null,
  score = 0,
  questionNumber = 1,
  totalQuestions = 10
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    onAnswer(answerIndex);
    
    setTimeout(() => {
      setSelectedAnswer(null);
      setShowResult(false);
      onNext();
    }, 2000);
  };

  if (!currentQuestion) return null;

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Question {questionNumber} of {totalQuestions}
        </span>
        <span className="font-medium text-foreground">
          Score: {score}
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        />
      </div>
      {/* Question */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-foreground mb-4">
          {currentQuestion?.question}
        </h4>
        
        <div className="space-y-2">
          {currentQuestion?.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => !showResult && handleAnswer(index)}
              disabled={showResult}
              className={`
                w-full p-3 rounded-lg border text-left transition-all spring-bounce
                ${showResult
                  ? index === currentQuestion?.correct
                    ? 'border-success bg-success/10 text-success'
                    : index === selectedAnswer
                    ? 'border-error bg-error/10 text-error' :'border-border'
                  : selectedAnswer === index
                  ? 'border-primary bg-primary/5' :'border-border hover:bg-muted/50'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium
                  ${showResult && index === currentQuestion?.correct
                    ? 'border-success bg-success text-success-foreground'
                    : showResult && index === selectedAnswer && index !== currentQuestion?.correct
                    ? 'border-error bg-error text-error-foreground'
                    : 'border-muted-foreground'
                  }
                `}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-sm">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const MiniGameLauncher = ({ 
  activeGame = null,
  onLaunchGame = () => {},
  onCloseGame = () => {},
  gameState = {},
  onGameAction = () => {},
  className = ""
}) => {
  const games = [
    {
      id: 'trivia',
      name: 'Trivia Quiz',
      icon: 'Brain',
      description: 'Test your knowledge with fun questions',
      players: 1,
      duration: '5-10 min'
    },
    {
      id: 'word-scramble',
      name: 'Word Scramble',
      icon: 'Shuffle',
      description: 'Unscramble letters to form words',
      players: 1,
      duration: '3-5 min'
    },
    {
      id: 'emoji-guess',
      name: 'Emoji Guess',
      icon: 'Smile',
      description: 'Guess the phrase from emojis',
      players: 1,
      duration: '2-4 min'
    },
    {
      id: 'drawing',
      name: 'Collaborative Draw',
      icon: 'Paintbrush',
      description: 'Draw together on a shared canvas',
      players: 2,
      duration: '10+ min'
    }
  ];

  const mockTriviaQuestion = {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correct: 2
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Gamepad2" size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              {activeGame ? games?.find(g => g?.id === activeGame)?.name : 'Mini Games'}
            </h3>
          </div>
          
          {activeGame && (
            <Button
              variant="ghost"
              size="icon"
              iconName="X"
              onClick={onCloseGame}
              className="spring-bounce"
              aria-label="Close game"
            />
          )}
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        {activeGame ? (
          /* Active Game */
          (<div className="space-y-4">
            {activeGame === 'trivia' && (
              <TriviaGame
                currentQuestion={mockTriviaQuestion}
                score={gameState?.score || 0}
                questionNumber={gameState?.questionNumber || 1}
                totalQuestions={10}
                onAnswer={(answer) => onGameAction('answer', answer)}
                onNext={() => onGameAction('next')}
              />
            )}
            {activeGame === 'word-scramble' && (
              <div className="text-center space-y-4">
                <div className="bg-muted/50 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-foreground mb-2 tracking-wider">
                    TCAH PMET
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Unscramble the letters above
                  </p>
                </div>
                
                <input
                  type="text"
                  placeholder="Your answer..."
                  className="w-full p-3 bg-input border border-border rounded-lg text-center font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                
                <Button variant="default" className="w-full">
                  Submit Answer
                </Button>
              </div>
            )}
            {activeGame === 'emoji-guess' && (
              <div className="text-center space-y-4">
                <div className="bg-muted/50 rounded-lg p-6">
                  <div className="text-4xl mb-4">🏠🔑</div>
                  <p className="text-sm text-muted-foreground">
                    Guess the phrase from the emojis
                  </p>
                </div>
                
                <input
                  type="text"
                  placeholder="Your guess..."
                  className="w-full p-3 bg-input border border-border rounded-lg text-center font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                
                <Button variant="default" className="w-full">
                  Submit Guess
                </Button>
              </div>
            )}
            {activeGame === 'drawing' && (
              <div className="text-center space-y-4">
                <div className="bg-muted/50 rounded-lg p-8 border-2 border-dashed border-muted-foreground">
                  <Icon name="Paintbrush" size={32} className="mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drawing canvas will open in full screen
                  </p>
                </div>
                
                <Button variant="default" className="w-full">
                  Open Canvas
                </Button>
              </div>
            )}
          </div>)
        ) : (
          /* Game Selection */
          (<div className="grid grid-cols-1 gap-3">
            {games?.map((game) => (
              <GameCard
                key={game?.id}
                game={game}
                onLaunch={onLaunchGame}
                isActive={activeGame === game?.id}
              />
            ))}
          </div>)
        )}
      </div>
      {/* Footer */}
      {!activeGame && (
        <div className="p-3 border-t border-border">
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Trophy" size={12} />
            <span>Earn achievements while playing</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniGameLauncher;
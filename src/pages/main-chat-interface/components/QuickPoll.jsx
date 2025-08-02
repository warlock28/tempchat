import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PollOption = ({ 
  option,
  totalVotes,
  hasVoted,
  userVote,
  onVote,
  showResults = false
}) => {
  const percentage = totalVotes > 0 ? (option?.votes / totalVotes) * 100 : 0;
  const isSelected = userVote === option?.id;

  return (
    <button
      onClick={() => !hasVoted && onVote(option?.id)}
      disabled={hasVoted}
      className={`
        w-full p-3 rounded-lg border text-left transition-all spring-bounce relative overflow-hidden
        ${hasVoted 
          ? 'cursor-default' :'hover:bg-muted/50 cursor-pointer'
        }
        ${isSelected 
          ? 'border-primary bg-primary/5' :'border-border'
        }
      `}
    >
      {/* Progress Bar Background */}
      {showResults && (
        <div 
          className="absolute inset-0 bg-primary/10 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      )}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Vote Indicator */}
          <div className={`
            w-4 h-4 rounded-full border-2 flex items-center justify-center
            ${isSelected 
              ? 'border-primary bg-primary' :'border-muted-foreground'
            }
          `}>
            {isSelected && (
              <div className="w-2 h-2 bg-primary-foreground rounded-full" />
            )}
          </div>
          
          <span className="text-sm font-medium text-foreground">
            {option?.text}
          </span>
        </div>
        
        {/* Results */}
        {showResults && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {option?.votes} vote{option?.votes !== 1 ? 's' : ''}
            </span>
            <span className="text-sm font-medium text-foreground">
              {percentage?.toFixed(0)}%
            </span>
          </div>
        )}
      </div>
    </button>
  );
};

const QuickPoll = ({ 
  poll = null,
  onCreatePoll = () => {},
  onVote = () => {},
  onClosePoll = () => {},
  canCreatePoll = false,
  className = ""
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleCreatePoll = () => {
    if (question?.trim() && options?.every(opt => opt?.trim())) {
      onCreatePoll({
        question: question?.trim(),
        options: options?.map((opt, index) => ({
          id: index,
          text: opt?.trim(),
          votes: 0
        })),
        createdAt: new Date(),
        totalVotes: 0
      });
      
      // Reset form
      setQuestion('');
      setOptions(['', '']);
      setShowCreateForm(false);
    }
  };

  const addOption = () => {
    if (options?.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options?.length > 2) {
      setOptions(options?.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  if (!poll && !canCreatePoll) {
    return null;
  }

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="BarChart3" size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              {poll ? 'Quick Poll' : 'Create Poll'}
            </h3>
          </div>
          
          {poll && canCreatePoll && (
            <Button
              variant="ghost"
              size="icon"
              iconName="X"
              onClick={onClosePoll}
              className="spring-bounce"
              aria-label="Close poll"
            />
          )}
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        {poll ? (
          /* Active Poll */
          (<div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">
              {poll?.question}
            </h4>
            <div className="space-y-2">
              {poll?.options?.map((option) => (
                <PollOption
                  key={option?.id}
                  option={option}
                  totalVotes={poll?.totalVotes}
                  hasVoted={poll?.userVote !== undefined}
                  userVote={poll?.userVote}
                  onVote={onVote}
                  showResults={poll?.userVote !== undefined}
                />
              ))}
            </div>
            <div className="text-xs text-muted-foreground text-center">
              {poll?.totalVotes} total vote{poll?.totalVotes !== 1 ? 's' : ''}
            </div>
          </div>)
        ) : showCreateForm ? (
          /* Create Poll Form */
          (<div className="space-y-4">
            <Input
              label="Poll Question"
              type="text"
              placeholder="What would you like to ask?"
              value={question}
              onChange={(e) => setQuestion(e?.target?.value)}
              required
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Options
              </label>
              {options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => updateOption(index, e?.target?.value)}
                    className="flex-1"
                    required
                  />
                  {options?.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      iconName="X"
                      onClick={() => removeOption(index)}
                      className="flex-shrink-0"
                    />
                  )}
                </div>
              ))}
              
              {options?.length < 6 && (
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={addOption}
                  className="w-full"
                >
                  Add Option
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="default"
                onClick={handleCreatePoll}
                disabled={!question?.trim() || !options?.every(opt => opt?.trim())}
                className="flex-1"
              >
                Create Poll
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>)
        ) : (
          /* Create Poll Button */
          (<Button
            variant="outline"
            iconName="Plus"
            iconPosition="left"
            onClick={() => setShowCreateForm(true)}
            className="w-full spring-bounce"
          >Create Quick Poll
                      </Button>)
        )}
      </div>
    </div>
  );
};

export default QuickPoll;
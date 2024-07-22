import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group'; // Import RadioGroup
import { colors, fontSizes, spacing } from './custom-styles'; // Import your custom styles

const Scorecard = ({ players, stopFrames, currentFrame, onSave }) => {
  const initialPlayerScores = () => {
    const frameScores = stopFrames[currentFrame]?.player_scores || [];
    return players.map(player => {
      const existingScore = frameScores.find(score => score.player === player.player_number);
      return { ...player, score: existingScore ? `$${existingScore.score}` : '' };
    });
  };
  const initialTieBreakResults = () => {
    return(stopFrames[currentFrame]?.tieBreakerWinner || [])
  

  };

  const initialSlotName = () => {
    return(stopFrames[currentFrame]?.SlotName || '')
  

  };

  const [slotName, setSlotName] = useState(initialSlotName);
  const [playerScores, setPlayerScores] = useState(initialPlayerScores());
  const [errors, setErrors] = useState({});
  const [tieBreakerWinner, setTieBreakerWinner] = useState(initialTieBreakResults);
  const [owner, setOwner] = useState('');

  useEffect(() => {
    setPlayerScores(initialPlayerScores());
  }, [currentFrame]);

  const handleScoreChange = (text, playerNumber) => {
    const value = text.replace(/[^0-9]/g, '');
    setPlayerScores(prevScores =>
      prevScores.map(score =>
        score.player_number === playerNumber ? { ...score, score: `$${value}` } : score
      )
    );
  };

  const validateFields = () => {
    let valid = true;
    let newErrors = {};

    if (!slotName.trim()) {
      newErrors.slotName = "Slot machine name is required.";
      valid = false;
    }

    playerScores.forEach(({ score, player_number }) => {
      if (!score.trim() || score === '$') {
        newErrors[player_number] = "Score cannot be blank.";
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };
  const determineOwner = () => {
    if (!checkForTie() || !tieBreakerWinner) {
      // If there is no tie, or there's no selected tiebreaker winner, find the highest scorer
      const maxScore = Math.max(...playerScores.map(({ score }) => parseFloat(score.replace('$', ''))));
      const highestScorer = playerScores.find(({ score }) => parseFloat(score.replace('$', '')) === maxScore);
      return highestScorer ? highestScorer.player_number : '';
    } else {
      // If there's a tie and we have a tiebreaker winner, return the tiebreaker winner
      return tieBreakerWinner;
    }
  };

  const handleSave = () => {
    if (validateFields()) {
      const determinedOwner = determineOwner();
      setOwner(determinedOwner);

      const updatedStopFrames = {
        ...stopFrames,
        [currentFrame]: {
          ...stopFrames[currentFrame],
        
          player_scores: playerScores.map(({ player_number, score }) => ({
            player: player_number,
            score: parseFloat(score.replace('$', ''))
          })),
          tieBreakerWinner: tieBreakerWinner,
          Owner: determinedOwner, // Ensure 'Owner' key is updated here as well
          SlotName: slotName,
        }
      };
      onSave(updatedStopFrames);
    }
  };

  const checkForTie = () => {
    const scores = playerScores.map(({ score }) => parseFloat(score.replace('$', '')));
    const maxScore = Math.max(...scores);
    const highestScorers = scores.filter(score => score === maxScore);
    return highestScorers.length > 1;
  };

  const getTiedPlayers = () => {
    const scores = playerScores.map(({ score }) => parseFloat(score.replace('$', '')));
    const maxScore = Math.max(...scores);
    return playerScores.filter(({ score }) => parseFloat(score.replace('$', '')) === maxScore);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Scorecard</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Slot Machine Name</Text>
        <TextInput
          style={[styles.input, errors.slotName && styles.errorInput]}
          value={slotName}
          onChangeText={setSlotName}
        />
        {errors.slotName && <Text style={styles.errorText}>{errors.slotName}</Text>}
      </View>

      <Text style={styles.label}>Player Scores</Text>
      <Text style={styles.infotext}>Enter the final amount for each player.</Text>
      <TouchableOpacity>
        <Text style={styles.infotext}>Click here to see how the scoring works.</Text>
      </TouchableOpacity>
      <Text style={styles.infotext}>Tie? Enter the tied scores and we'll help you resolve the tiebreak!</Text>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderLabel}>Player Name</Text>
        <Text style={styles.tableHeaderLabel}>Score</Text>
      </View>

      {/* Table Rows */}
      {players.map((player, index) => (
        <View key={index} style={[styles.tableRow, index % 2 === 0 && styles.evenRow]}>
          <Text style={styles.playerName}>{player.player_name}</Text>
          <TextInput
            style={[styles.scoreInput, errors[player.player_number] && styles.errorInput]}
            value={playerScores.find(ps => ps.player_number === player.player_number).score}
            onChangeText={(text) => handleScoreChange(text, player.player_number)}
            placeholder="$0"
            keyboardType="numeric"
          />
          {errors[player.player_number] && <Text style={styles.errorTextSmall}>{errors[player.player_number]}</Text>}
        </View>
      ))}

      {/* Tie Breaker Box */}
      {checkForTie() && (
        <View style={styles.tieBreakerBox}>
          <Text style={styles.tieBreakerText}>Tiebreaker - Sudden Death Spins!</Text>
          <Text style={styles.infotext}>
            In the event of a tie, each player contributes an equal amount of money into the machine. The tied players then take turns to spin. The player with the highest payout from their spin wins. If all players receive the same payout, the sudden death spins continue. Any player who gets a lower payout than the others is eliminated, and the remaining players continue the sudden death spins until there is a winner.
          </Text>

          <Text style={styles.radioLabel}>Select the tiebreaker winner:</Text>
          <RadioGroup
            layout="column" // Align buttons vertically
            containerStyle={styles.radioGroup}
            radioButtons={getTiedPlayers().map(player => ({
              id: player.player_number.toString(),
              label: player.player_name,
              color: colors.primary,
            }))}
            onPress={(selectedId) => setTieBreakerWinner(selectedId)}
            selectedId={tieBreakerWinner}
          />
        </View>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.large,
    backgroundColor: colors.background,
    borderRadius: 20,
    width: '100%',
  },
  title: {
    fontSize: fontSizes.large,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.large,
    alignSelf: 'center',
  },
  inputGroup: {
    width: '100%',
    marginBottom: spacing.large,
  },
  label: {
    fontSize: fontSizes.medium,
    color: colors.textPrimary,
    marginBottom: spacing.small,
    fontWeight: 'bold',
  },
  infotext: {
    fontSize: fontSizes.medium,
    color: colors.textPrimary,
    marginBottom: spacing.small,
  },
  input: {
    width: '100%',
    padding: spacing.small,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: spacing.small,
    backgroundColor: '#fff',
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: fontSizes.small,
    marginBottom: spacing.small,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.headerBackground,
  },
  tableHeaderLabel: {
    fontSize: fontSizes.medium,
    color: colors.textSecondary,
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  evenRow: {
    backgroundColor: colors.rowEvenBackground,
  },
  playerName: {
    fontSize: fontSizes.medium,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'left',
    paddingHorizontal: spacing.small,
  },
  scoreInput: {
    width: '30%',
    padding: spacing.small,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 5,
    textAlign: 'right',
    backgroundColor: '#fff',
    marginHorizontal: spacing.small,
  },
  errorTextSmall: {
    color: 'red',
    fontSize: fontSizes.small,
    marginHorizontal: spacing.small,
  },
  tieBreakerBox: {
    marginTop: spacing.large,
    padding: spacing.large,
    backgroundColor: colors.warningBackground,
    borderRadius: 10,
    alignItems: 'center',
  },
  tieBreakerText: {
    color: colors.warningText,
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
    marginBottom: spacing.large,
  },
 radioGroup: {
  alignSelf: 'stretch',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: spacing.medium,
},
radioButtonContainer: {
  flexDirection: 'row',
  alignItems: 'center',
},
radioButtonLabel: {
  marginLeft: spacing.small,
  fontSize: fontSizes.medium,
  color: colors.textPrimary,
},
radioLabel: {
    color: colors.textPrimary,
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
    marginBottom: spacing.medium,
  },

  saveButton: {
    marginTop: spacing.large,
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.large,
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonText: {
    color: colors.textSecondary,
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
  },
});

export default Scorecard;
 

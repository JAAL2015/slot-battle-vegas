import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text, Dimensions, Animated, Touchable } from 'react-native';
import imagePaths from './stripImageMap'; // Ensure this import path is correct and images are properly mapped
import { Ionicons } from '@expo/vector-icons'; // Ensure you have installed @expo/vector-icons
import { colors, fontSizes, spacing } from './custom-styles';
import imagePathsMasks from './stripImageMapMasks'; // Ensure this import path is correct and images are properly mapped
import Scorecard from './Scorecard';
import imagePathsToStrip from './toStripImageMap';
import { SvgXml } from 'react-native-svg';
import StripSVGs from '../../assets/svg/stripoverlays.js';
import AriaSvg from '../../assets/svg/aria.js';

const { width, height } = Dimensions.get('window');



const Slider = ({ players }) => {

  const fills={
    "Mandalay" : "red",
    "Aria" : "blue"
  }


  // Function to calculate scaled dimensions based on 'cover' resizeMode
const calculateScaledDimensions = (imageWidth, imageHeight, containerWidth, containerHeight) => {
  const imageRatio = imageWidth / imageHeight;
  const containerRatio = containerWidth / containerHeight;

  let scaledWidth, scaledHeight;

  if (containerRatio > imageRatio) {
    // Container is wider relative to its height than the image
    scaledWidth = containerWidth;
    scaledHeight = containerWidth / imageRatio;
  } else {
    // Container is taller relative to its width than the image
    scaledHeight = containerHeight;
    scaledWidth = containerHeight * imageRatio;
  }

  return { scaledWidth, scaledHeight };
};


const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

useEffect(() => {
  const imageUri = Image.resolveAssetSource(imagePaths[0]).uri;

  Image.getSize(imageUri, (width, height) => {
    const scaledDimensions = calculateScaledDimensions(width, height, windowWidth, windowHeight);
    setImageDimensions(scaledDimensions);
    console.log(scaledDimensions);
  }, (error) => {
    console.error(`Error getting image size: ${error}`);
  });
}, []);



  const [stopFrames, setStopFrames] = useState({
   
      "0": { Name: "Mandalay Bay", Owner: null },
      "60": { Name: "Luxor", Owner: 1 },
      "120": { Name: "Excalibur", Owner: null },
      "180": { Name: "New York New York", Owner: null },
      "240": { Name: "MGM Grand", Owner: null },
      "300": { Name: "Park MGM", Owner: null },
      "360": { Name: "Aria", Owner: null },
      "420": { Name: "Cosmopolitan", Owner: null },
      "480": { Name: "Planet Hollywood", Owner: null },
      "540": { Name: "Paris", Owner: null },
      "600": { Name: "Horseshoe", Owner: null },
      "660": { Name: "Bellagio", Owner: null },
      "720": { Name: "Caesars Palace", Owner: null },
      "780": { Name: "Cromwell", Owner: null },
      "840": { Name: "Flamingo", Owner: null },
      "900": { Name: "Linq", Owner: null },
      "960": { Name: "Harrahs", Owner: null },
      "1020": { Name: "Casino Royal", Owner: null },
      "1080": { Name: "Venetian", Owner: null },
      "1140": { Name: "Palazzo", Owner: null },
      "1200": { Name: "Treasure Island", Owner: null },
      "1260": { Name: "Wynn", Owner: null },
      "1320": { Name: "Encore", Owner: null },
      "1380": { Name: "Resort's World", Owner: null },
      "1440": { Name: "Circus Circus", Owner: null },
      "1500": { Name: "Fontainebleau", Owner: null },
      "1560": { Name: "Sahara", Owner: null },
      "1620": { Name: "Stratosphere", Owner: null }
    
  });
  
  

  const slot = {
    property_name: "Luxor",
    player_scores: [],
  };

  const saveScores = (updatedSlot) => {
    console.log("Updated Slot: ", updatedSlot);
    setStopFrames(updatedSlot);
    setMaskTintColor(getOwnerColor(updatedSlot[currentFrame].Owner));
    togglePanel();
    
  };
  
  const handleSVGClick = (property) => {
    console.log('SVG clicked: ', property);
  };

  

  const [currentFrame, setCurrentFrame] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [maskPath, setMaskPath] = useState(imagePathsMasks[0]);
  const [maskTintColor, setMaskTintColor] = useState('#00000080'); // Default to white with 50% opacity
  const [stripMode, setStripMode] = useState(false);
  const [currentStripFrame, setCurrentStripFrame] = useState(0);
  const animationFrameId = useRef(null);
  const titleTranslateY = useRef(new Animated.Value(0)).current;
  const panelTranslateY = useRef(new Animated.Value(0)).current; 
  const initialHeight = new Animated.Value(100); // Initial position visible
  const [panelHeight, setPanelHeight] = useState(100);
  const [showSVGs, setShowSVGs] = useState(false); // New state for SVG visibility

  const maskOpacity = useRef(new Animated.Value(1)).current;
  const imageOpacity = useRef(new Animated.Value(0.5)).current; // New animated value for image opacity

  const getOwnerColor = (owner) => {
    switch(owner) {
      case 1:
        return '#FF000080'; // Red with 50% opacity
      case 2:
        return '#0000FF80'; // Blue with 50% opacity
      case 3:
        return '#00800080'; // Green with 50% opacity
      case 4:
        return '#FFFF0080'; // Yellow with 50% opacity
      default:
        return '#00000080';
    }
  };

  
  const handleGoToStripView = () => {
    setStripMode(true);
    console.log(`Animating to strip view`);
    clearTimeout(animationFrameId.current);
   
      console.log(`Animating to strip view`);
      // Slide the title container and panel out of view and fade out mask
      Animated.parallel([
        Animated.timing(titleTranslateY, {
          toValue: -60,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(panelTranslateY, {
          toValue: +260,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.parallel([
          Animated.timing(maskOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
          }),
          Animated.timing(imageOpacity, {
            toValue: 1, // Return the image opacity to 100%
            duration: 300,
            useNativeDriver: true
          })
        ])
      ]).start(() => {
        animateFrames(currentFrame+1620, currentFrame+1680, true);
        setTimeout(() => setShowSVGs(true), 3000)
        
        
      });
      setStripMode(true);
      
    
  };


  const togglePanel = () => {
    if (isExpanded) {
      setPanelHeight(100);
    } else {
      setPanelHeight(height - 150);
    }
    setIsExpanded(!isExpanded);
  };

  const findNextStopFrame = (direction) => {
    const stopFrameKeys = Object.keys(stopFrames).map(Number);
    if (direction === 'forward') {
      return Math.min(
        ...stopFrameKeys.filter((key) => key > currentFrame)
      );
    }
    if (direction === 'backward') {
      return Math.max(
        ...stopFrameKeys.filter((key) => key < currentFrame)
      );
    }
  };

  const animateFrames = (start, end, stripView = false) => {
    const increment = start < end ? 1 : -1;
    let frame = start;

    const animate = () => {
      frame += increment;
      setCurrentFrame(frame);

      if (frame !== end) {
        animationFrameId.current = setTimeout(animate, 1000 / 30); // 30 fps

      } else {
        if (!stripView) {
        // Slide the title container back into view after the frame transition
        Animated.parallel([
          Animated.timing(titleTranslateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
          }),
          Animated.timing(panelTranslateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
          })
        ]).start(() => {
          
          // Fade in the new mask with the appropriate color
          setMaskPath(imagePathsMasks[end/60]);
          setMaskTintColor(getOwnerColor(stopFrames[end].Owner));
          Animated.parallel([
            Animated.timing(maskOpacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true
            }),
            Animated.timing(imageOpacity, {
              toValue: 0.5, // Change the image opacity to 50%
              duration: 300,
              useNativeDriver: true
            })
          ]).start();
        
        });
      }
    }
    };

    animate();
  };

  const handleForward = () => {
    clearTimeout(animationFrameId.current);
    const nextFrame = findNextStopFrame('forward');
    if (nextFrame !== undefined) {
      console.log(`Animating forward to frame ${nextFrame}`);
      // Slide the title container and panel out of view and fade out mask
      Animated.parallel([
        Animated.timing(titleTranslateY, {
          toValue: -60,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(panelTranslateY, {
          toValue: +260,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.parallel([
          Animated.timing(maskOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
          }),
          Animated.timing(imageOpacity, {
            toValue: 1, // Return the image opacity to 100%
            duration: 300,
            useNativeDriver: true
          })
        ])
      ]).start(() => {
        animateFrames(currentFrame, nextFrame);
      });
    }
  };

  const handleBackward = () => {
    clearTimeout(animationFrameId.current);
    const prevFrame = findNextStopFrame('backward');
    if (prevFrame !== undefined) {
      console.log(`Animating backward to frame ${prevFrame}`);
      // Slide the title container and panel out of view and fade out mask
      Animated.parallel([
        Animated.timing(titleTranslateY, {
          toValue: -60,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(panelTranslateY, {
          toValue: +260,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.parallel([
          Animated.timing(maskOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
          }),
          Animated.timing(imageOpacity, {
            toValue: 1, // Return the image opacity to 100%
            duration: 300,
            useNativeDriver: true
          })
        ])
      ]).start(() => {
        animateFrames(currentFrame, prevFrame);
      });
    }
  };

  const stopFrameKeys = Object.keys(stopFrames).map(Number);
  const firstFrame = Math.min(...stopFrameKeys);
  const lastFrame = Math.max(...stopFrameKeys);

  const prevFrameAvailable = findNextStopFrame('backward') !== undefined && currentFrame !== firstFrame;
  const nextFrameAvailable = findNextStopFrame('forward') !== undefined && currentFrame !== lastFrame;

  return (
    <View style={styles.container}>
      <Animated.View id="title" style={[styles.titleContainer,  { transform: [{ translateY: titleTranslateY }] }]}>
      
        <Text style={styles.title}>
          {stopFrames[currentFrame]?.Name || ''}
        </Text>
        <TouchableOpacity style={{flexDirection: 'row',alignItems : 'center' , position: 'absolute', right: 20, zIndex: 10}} onPress={handleGoToStripView}>
      
      <Text style={styles.titleButton}>
          Strip
        </Text>
        <Ionicons name="arrow-up" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
       
      </Animated.View>
      <View style={styles.imageContainer}>

      {stripMode && showSVGs &&(
       

 
    <View style={styles.overlay}>
      <StripSVGs width={width} height={height} fills={fills} onPress={handleSVGClick}/>
    </View>
  





)}

        {imagePaths.length > 0 && (
          <Animated.Image
            source={imagePaths[currentFrame]} 
            style={[styles.image, { opacity: imageOpacity }]} // Bind the image opacity to the animated value
            onError={(error) => console.log(`Error loading image: ${error.nativeEvent.error}`)}
          />
        )}
        {/* Overlay Mask */}
        <Animated.Image
          source={maskPath}
          style={[styles.mask, { opacity: maskOpacity, tintColor: maskTintColor }]}
        />
      

      </View>

      {prevFrameAvailable && !isExpanded && !stripMode && (
        <TouchableOpacity style={[styles.button, styles.leftButton]} onPress={handleBackward}>
          <Ionicons name="arrow-back" size={32} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
      {nextFrameAvailable && !isExpanded && !stripMode && (
        <TouchableOpacity style={[styles.button, styles.rightButton]} onPress={handleForward}>
          <Ionicons name="arrow-forward" size={32} color={colors.textSecondary} />
        </TouchableOpacity>
      )}

      {/* Sliding Panel */}
      {!showSVGs && (
      <Animated.View id="outerpanel" style={[styles.outerpanel, { transform: [{ translateY: panelTranslateY }] }]}>
        <View style={[styles.panel, { height: panelHeight }]}>
          <View style={styles.panelContent}>
          {!isExpanded && (
            <Text style={styles.ownerText}>
              {stopFrames[currentFrame]?.Owner === null 
                ? 'Not currently owned' 
                : `Owned by Player ${stopFrames[currentFrame]?.Owner}`}
            </Text> )}
            <View style={styles.scorecard}>
            {isExpanded && (
                 <Scorecard players={players} stopFrames={stopFrames} currentFrame={currentFrame} onSave={saveScores} />
                ) }
 <TouchableOpacity onPress={togglePanel} style={styles.toggleButton}>
             
             <Text style={styles.toggleButtonText}>
               {isExpanded ? 'Hide' : 'Scorecard'}
             </Text>
           </TouchableOpacity>
              </View>
           
          </View>
        </View>
      </Animated.View> )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  titleContainer: {
    position: 'absolute',
    top: 0,
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary, // Semi-transparent background
    zIndex: 20,
   

  },
  scorecard: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
    color: colors.textSecondary,
    zIndex: 10
  },

  titleButton: {
    fontSize: fontSizes.small,
    fontWeight: 'bold',
    color: colors.textSecondary,
    zIndex: 10
  },
  imageContainer: {
    position: 'relative', // Needed to overlay the mask on the main image
    width: width,
    height: height
  },
  image: {
    width: width,
    height: height, 
    resizeMode: 'cover'
    
  },

  
  container1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    width: width,
    height: height,
    zindex: 50,
    resizeMode: 'cover'
  },
  svgContainer: {
    position: 'relative',
    width: width,
    height: height,
    zindex: 50,
    resizeMode: 'cover'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    zIndex: 80,
    resizeMode: 'cover'
  },
    stripModeText: {
      fontSize: fontSizes.medium,
      fontWeight: 'bold',
      color: colors.textSecondary,
    },
    
  
  
  mask: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: height,
    resizeMode: 'cover',
    zIndex: 4
  },
  button: {
    position: 'absolute',
    top: '50%',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.textSecondary,
    zIndex: 3,
    fontSize: fontSizes.medium,
    textAlign: 'center'
  },
  leftButton: {
    left: 20
  },
  rightButton: {
    right: 20
  },
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0, 
    right: 0,
    backgroundColor: colors.secondary, // Semi-transparent background to create shadow effect
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    zIndex: 2,
    height: 100
  },
  outerpanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    zIndex: 2,
  },
  panelContent: {
    padding: spacing.medium,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: fontSizes.medium
  },
  ownerText: {
    color: colors.textSecondary,
    fontSize: fontSizes.medium,
    fontWeight: 'bold'
  },
  toggleButton: {
    marginTop: spacing.small,
    padding: spacing.medium,
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonText: {
    color: colors.textSecondary,
    fontSize: fontSizes.medium,
    fontWeight: 'bold'

  }
});

export default Slider;

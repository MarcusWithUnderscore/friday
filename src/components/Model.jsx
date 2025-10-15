import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function Avatar(props) {
  const { animation = "Idle", ...restProps } = props;
  const [headFollow, setHeadFollow] = useState(false);
  const [cursorFollow, setCursorFollow] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const group = useRef();
  const { nodes, materials } = useGLTF("models/model.glb");

  const { animations: fbxAnimations } = useFBX("animations/Idle.fbx");

  // Setup animations and rename them
  const animationList = fbxAnimations && fbxAnimations.length > 0 
    ? fbxAnimations.map((clip, i) => {
        // Rename the animation to "Idle" regardless of original name
        clip.name = "Idle";
        return clip;
      })
    : [];

  if (animationList.length > 0) {
    console.log("Available animations:", animationList.map(a => a.name));
  } else {
    console.warn("No animations found in Idle.fbx");
  }

  const { actions } = useAnimations(animationList, group);

  useFrame((state) => {
    if (!group.current) return;

    if (headFollow) {
      const head = group.current.getObjectByName("Head");
      if (head) head.lookAt(state.camera.position);
    }
    if (cursorFollow) {
      const spine = group.current.getObjectByName("Spine2");
      if (spine) {
        const target = new THREE.Vector3(state.mouse.x, state.mouse.y, 1);
        spine.lookAt(target);
      }
    }
  });

  useEffect(() => {
    if (!actions || !animation) return;

    const action = actions[animation];
    if (action) {
      console.log("Playing animation:", animation);
      action.play();
      return () => {
        action.stop();
      };
    } else {
      console.warn(`Animation "${animation}" not found. Available:`, Object.keys(actions));
    }
  }, [animation, actions]);

  useEffect(() => {
    Object.values(materials).forEach((material) => {
      material.wireframe = wireframe;
    });
  }, [wireframe, materials]);

  return (
    <group {...restProps} ref={group} dispose={null}>
      <group>
        <primitive object={nodes.Hips} />
        <skinnedMesh
          geometry={nodes.Wolf3D_Body.geometry}
          material={materials.Wolf3D_Body}
          skeleton={nodes.Wolf3D_Body.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
          material={materials.Wolf3D_Outfit_Bottom}
          skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
          material={materials.Wolf3D_Outfit_Footwear}
          skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Outfit_Top.geometry}
          material={materials.Wolf3D_Outfit_Top}
          skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Hair.geometry}
          material={materials.Wolf3D_Hair}
          skeleton={nodes.Wolf3D_Hair.skeleton}
        />
        <skinnedMesh
          name="EyeLeft"
          geometry={nodes.EyeLeft.geometry}
          material={materials.Wolf3D_Eye}
          skeleton={nodes.EyeLeft.skeleton}
          morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
          morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
        />
        <skinnedMesh
          name="EyeRight"
          geometry={nodes.EyeRight.geometry}
          material={materials.Wolf3D_Eye}
          skeleton={nodes.EyeRight.skeleton}
          morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
          morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
        />
        <skinnedMesh
          name="Wolf3D_Head"
          geometry={nodes.Wolf3D_Head.geometry}
          material={materials.Wolf3D_Skin}
          skeleton={nodes.Wolf3D_Head.skeleton}
          morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
          morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
        />
        <skinnedMesh
          name="Wolf3D_Teeth"
          geometry={nodes.Wolf3D_Teeth.geometry}
          material={materials.Wolf3D_Teeth}
          skeleton={nodes.Wolf3D_Teeth.skeleton}
          morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
          morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
        />
      </group>
    </group>
  );
}

useGLTF.preload("models/model.glb");
<template>
  <div class="audio-player-container">
    <!-- Category Filter -->
    <div class="category-filter" v-if="categories.length > 0">
      <select v-model="selectedCategory" @change="filterTracks">
        <option value="">Все категории</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    <!-- Tracks List -->
    <div class="tracks-list">
      <div 
        v-for="track in filteredTracks" 
        :key="track.id" 
        class="track-item"
        :class="{ 'active': activeTrackId === track.id }"
      >
        <div class="track-info">
          <span class="track-name">{{ track.name }}</span>
          <span class="track-category" v-if="track.category_id">{{ track.category_id }}</span>
        </div>
        
        <div class="audio-player">
          <audio
            ref="audioRefs"
            :src="track.src"
            @timeupdate="(e) => onTimeUpdate(e, track.id)"
            @loadedmetadata="(e) => onLoadedMetadata(e, track.id)"
            @ended="(e) => onEnded(e, track.id)"
          />
                      <slot
              :isPlaying="isPlaying"
              :currentTime="currentTime"
              :duration="duration"
              :play="() => play(track.id)"
              :pause="() => pause(track.id)"
              :toggle="() => toggle(track.id)"
              :setCurrentTime="(time: number) => setCurrentTime(time, track.id)"
              :track="track"
              :trackIndex="track.id"
            >
            <!-- Default controls if no slot provided -->
            <button @click="toggle(track.id)">{{ isPlaying && activeTrackId === track.id ? 'Pause' : 'Play' }}</button>
            <slot name="progress" :currentTime="currentTime" :duration="duration" :setCurrentTime="(time: number) => setCurrentTime(time, track.id)">
              <input
                type="range"
                min="0"
                :max="duration"
                step="0.1"
                :value="currentTime"
                @input="(e) => onSliderChange(e, track.id)"
              />
            </slot>
            <slot name="time" :currentTime="currentTime" :duration="duration">
              <span>{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
            </slot>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, computed } from 'vue';

interface Track {
  id: string;
  src: string;
  name: string;
  category_id: string;
}

const props = defineProps<{
  tracks: Track[];
}>();

const emit = defineEmits<{
  (e: 'play', trackIndex: number): void;
  (e: 'pause', trackIndex: number): void;
  (e: 'ended', trackIndex: number): void;
  (e: 'timeupdate', time: number, trackIndex: number): void;
  (e: 'trackChange', trackIndex: number): void;
}>();

const audioRefs = ref<HTMLAudioElement[]>([]);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const activeTrackId = ref<string | null>(null);
const selectedCategory = ref('');

// Computed properties
const categories = computed(() => {
  const uniqueCategories = new Set(props.tracks.map(track => track.category_id).filter(Boolean));
  return Array.from(uniqueCategories);
});

const filteredTracks = computed(() => {
  if (!selectedCategory.value) {
    return props.tracks;
  }
  return props.tracks.filter(track => track.category_id === selectedCategory.value);
});

// Methods
function play(trackId: string) {
  if (activeTrackId.value && activeTrackId.value !== trackId) {
    pause(activeTrackId.value);
  }
  activeTrackId.value = trackId;
  const audio = audioRefs.value.find((audio, i) => filteredTracks.value[i].id === trackId);
  if (audio) audio.play();
}

function pause(trackId: string) {
  const audio = audioRefs.value.find((audio, i) => filteredTracks.value[i].id === trackId);
  if (audio) audio.pause();
  if (activeTrackId.value === trackId) {
    activeTrackId.value = null;
  }
}

function toggle(trackId: string) {
  if (isPlaying.value && activeTrackId.value === trackId) {
    pause(trackId);
  } else {
    play(trackId);
  }
}

function setCurrentTime(time: number, trackId: string) {
  const audio = audioRefs.value.find((audio, i) => filteredTracks.value[i].id === trackId);
  if (audio) audio.currentTime = time;
}

function onTimeUpdate(event: Event, trackId: string) {
  if (activeTrackId.value === trackId) {
    const audio = event.target as HTMLAudioElement;
    currentTime.value = audio.currentTime;
    emit('timeupdate', currentTime.value, trackId);
  }
}

function onLoadedMetadata(event: Event, trackId: string) {
  if (activeTrackId.value === trackId) {
    const audio = event.target as HTMLAudioElement;
    duration.value = audio.duration;
  }
}

function onEnded(event: Event, trackId: string) {
  if (activeTrackId.value === trackId) {
    isPlaying.value = false;
    activeTrackId.value = null;
    emit('ended', trackId);
  }
}

function onSliderChange(event: Event, trackId: string) {
  const value = Number((event.target as HTMLInputElement).value);
  setCurrentTime(value, trackId);
}

function formatTime(time: number) {
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

function filterTracks() {
  // Reset active track when filtering
  if (activeTrackId.value) {
    pause(activeTrackId.value);
  }
}

// Watchers
watch(isPlaying, (val) => {
  if (val) {
    emit('play', activeTrackId.value);
  } else {
    emit('pause', activeTrackId.value);
  }
});

watch(activeTrackId, (newIndex) => {
  emit('trackChange', newIndex);
});

// Sync isPlaying with audio element
watch(
  () => audioRefs.value,
  (audios) => {
    audios.forEach((audio, index) => {
      if (!audio) return;
      audio.onplay = () => {
        isPlaying.value = true;
        activeTrackId.value = filteredTracks.value[index].id;
      };
      audio.onpause = () => {
        if (activeTrackId.value === filteredTracks.value[index].id) {
          isPlaying.value = false;
        }
      };
    });
  },
  { immediate: true }
);
</script>

<style scoped>
.audio-player-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-filter {
  margin-bottom: 1rem;
}

.category-filter select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
}

.tracks-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.track-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s ease;
}

.track-item.active {
  border-color: #007bff;
  background-color: #f8f9fa;
}

.track-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.track-name {
  font-weight: 500;
  color: #333;
}

.track-category {
  font-size: 0.875rem;
  color: #666;
  background: #e9ecef;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.audio-player {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.audio-player button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
  transition: background 0.2s ease;
}

.audio-player button:hover {
  background: #0056b3;
}

.audio-player input[type="range"] {
  flex: 1;
}

.audio-player span {
  font-size: 0.875rem;
  color: #666;
  min-width: 80px;
}
</style>
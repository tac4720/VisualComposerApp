
from pydub import AudioSegment
from pydub.silence import split_on_silence
import os

# 設定
input_directory = '.'  # 音声ファイルが保存されているディレクトリ
output_directory = './tmp'  # 新しいディレクトリ

# 出力ディレクトリを作成
if not os.path.exists(output_directory):
    os.makedirs(output_directory)

def align_audio(file_path, output_path, silence_thresh=-40, min_silence_len=500):
    # 音声ファイルを読み込む
    audio = AudioSegment.from_file(file_path)

    # 音声をサイレンスで分割
    segments = split_on_silence(audio, silence_thresh=silence_thresh, min_silence_len=min_silence_len)

    # 最初のセグメントを使用
    if segments:
        aligned_audio = segments[0]
        # トリミング後の音声を保存
        aligned_audio.export(output_path, format="wav")

# 音声ファイルを処理
for file_name in os.listdir(input_directory):
    if file_name.endswith('.wav'):
        input_path = os.path.join(input_directory, file_name)
        output_path = os.path.join(output_directory, file_name)
        align_audio(input_path, output_path)

print("音声ファイルの処理が完了しました。")
